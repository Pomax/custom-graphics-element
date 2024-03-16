import fs from "node:fs";

import { format } from "prettier";
import { marked } from "marked";

/**
 * Convert "code from the comment block" into proper source code.
 */
async function blockHTMLToCode(key, code) {
  // strip HTML wrapper
  code = code
    .replace(`<graphics-element>`, ``)
    .replace(`<graphics-source>`, ``)
    .replace(`</graphics-source>`, ``)
    .replace(`</graphics-element>`, ``);

  // remove comment notation
  code = code
    .replace(/\<\/?graphics-[^>]+\>/g, ``)
    .split(`\n`)
    .map((l) => l.replace(/^(\s*\*)/, ``).replace(/\*+$/, ``))
    .join(`\n`);

  // then format using Prettier
  return await format(code, { semi: true, parser: "babel" });
}

/**
 * Make text safe for putting in a <pre>
 */
function escape(s) {
  let lookup = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return s.replace(/[&"'<>]/g, (c) => lookup[c]);
}

/**
 * convert markdown to HTML
 */
function markdownToHTML(markdown) {
  return marked.parse(markdown);
}

/**
 * ...
 */
async function formPageCode(declarations, metadata) {
  return (
    await Promise.all(
      Object.entries(metadata)
        .sort(([a, _], [b, __]) => {
          a = a.toLowerCase();
          b = b.toLowerCase();
          return a < b ? -1 : a > b ? 1 : 0;
        })
        .map(async ([key, value]) => {
          const isConstant = declarations[key].declarations.some((v) =>
            v.includes(`declare const`)
          );

          // Include the call signature(s)
          const signatures = await declarations[key].declarations
            .map((v, pos) => {
              // Are we dealing with a function?
              if (v.includes(`declare function`)) {
                // call signature
                const signature = v
                  .replace(`declare function `, ``)
                  .replace(`: void`, ``)
                  .replace(`;`, ``);

                // call parameters
                let params = ``;
                if (declarations[key].params[pos]) {
                  const { returnType, see, ...rest } =
                    declarations[key].params[pos];
                  params =
                    `<ul class="params">` +
                    Object.entries(rest)
                      .map(([key, { type, desc }]) => {
                        return `<li><code>${key}</code> - ${desc}</li>`;
                      })
                      .join(``) +
                    `</ul>` +
                    (returnType.type !== `void`
                      ? `<p>returns ${returnType.desc?.[0].toLowerCase() + returnType.desc?.substring(1)} (<code>${returnType.type}</code>)</p>`
                      : ``);
                }

                return `<li><code>${signature}</code>${params}</li>`;
              }

              // not a function (so right now: a const)
              return ``;
            })
            .join(`\n`);

          // If there's 1 signature, use an unordered list, but if there are
          // two or more, use an ordered (numbered) list.
          const siglist =
            declarations[key].declarations.length > 1 ? `ol` : `ul`;

          const signatureCode = isConstant
            ? `<code class="const">constant</code>`
            : !signatures
              ? ``
              : `<${siglist} class="signatures">${signatures}</${siglist}>`;

          // With the example as both a graphics element and <pre>'d source code.
          const gfxAndCode = (
            await Promise.all(
              value.examples.map(async (block) => {
                const code = await blockHTMLToCode(key, block);
                return `<!-- prettier-ignore -->
            <graphics-element width="200px" height="200px">
              <graphics-source>\n${code}\n</graphics-source>
            </graphics-element>
            <pre><code class="language-js">${escape(code)}</code></pre>`;
              })
            )
          ).join(`\n\n`);
          let seeAlso = ``;
          let { see } = declarations[key];
          if (see && see.length) {
            seeAlso =
              `<h3>See also:</h3><ul>` +
              see.map((v) => `<li><a href="#${v}">${v}</a></li>`).join(``) +
              `</ul>`;
          }

          return `
            <section id="${key}">
              <h1><a href="#${key}">${key}</a> <a href="#top">top</a></h1>
              ${signatureCode}
              <h3>Description</h3>
              ${markdownToHTML(value.description)}
              ${gfxAndCode ? `<h3>Examples</h3>` : ``}
              ${gfxAndCode}
              ${seeAlso}
            </section>
          `;
        })
    )
  ).join(`\n\n`);
}

/**
 * ...
 */
function formToC(declarations) {
  // Derive the Table of Content HTML
  const dValues = Object.values(declarations)
    // let's make sure we know whether something's a constant
    .map((v) => {
      v.constant = v.declarations.some((v) => v.includes(`declare const`));
      return v;
    })
    // Then let's sort them on namespace first, then on whether
    // or not they're constants, and then alphabetically.
    .sort((a, b) => {
      const { namespace: na, fname: fa } = a;
      const { namespace: nb, fname: fb } = b;

      // same namesace?
      if (na === nb) {
        // constant
        const ac = a.constant;
        const bc = b.constant;
        if (ac || bc) {
          if (ac && !bc) return -1;
          if (!ac && bc) return 1;
        }
        // either both constants, or both functions
        return fa < fb ? -1 : fa > fb ? 1 : 0;
      }
      // different namespace.
      return na < nb ? -1 : na > nb ? 1 : 0;
    });

  return (
    `<h4 class="sep">${dValues[0].namespace} ${dValues[0].namespace !== `constants` ? `functions` : ``}</h4>` +
    `<ul>` +
    dValues
      .map((a, pos, data) => {
        const b = data[pos + 1];
        if (b && a.namespace !== b.namespace) {
          b.__sep = true;
        }
        return a;
      })
      .map(
        (v, pos) =>
          (v.__sep && pos
            ? `</ul><h4 class="sep">${v.namespace} functions</h4><ul>`
            : ``) +
          `<li><a href="#${v.fname}" class="${v.constant ? `const` : `fn`}">${v.fname}</a></li>`
      )
      .join(``) +
    `</ul>`
  );
}

export async function formAPIPage(declarations, metadata) {
  const toc = await formToC(declarations);
  const pageCode = await formPageCode(declarations, metadata);

  /**
   * Create a api.html file
   */
  fs.writeFileSync(
    `./api.html`,
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>The &lt;graphics-element&gt; API</title>
    <script type="module" src="dist/graphics-element.js" async></script>
    <link rel="stylesheet" href="dist/graphics-element.css" async />
    <link rel="stylesheet" href="index.css" async />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs.min.css"
      async
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/lioshi.min.css"
      media="(prefers-color-scheme: dark)"
      async
    />
  </head>
  <body>

    <h1 id="top" style="text-align: center; font-size: 2.5em">
      The <a href="."><span>&lt;</span>graphics-element<span>&gt;</span></a> API
    </h1>

    <p>
      This is the API documentation for &lt;graphics-element&gt; source code,
      which at its code is simply plain JavaScript with a bunch of extra global
      constants and functions to allow you to quickly but cleanly get (interactive,
      and animated) graphics onto a page using the native web stack instead of
      needing some kind of build system.
    </p>

    <ul>
      <li>Visit <a href=".">the main page</a></li>
      <li>Read <a href="docs.html">the documentation</a></li>
      <li>Check out the <a href="api.html">API</a> (wait, you're already here!)</li>
      <li>Try the <a href="edit/">editor playground</a></li>
      <li>
        View the project
        <a href="https://github.com/Pomax/custom-graphics-element">on GitHub</a>
      </li>
    </ul>

    <p>
      Note that the index just below is ordered by category, but the full list
      itself is ordered alphabetically to allow you to search by scrolling
      as well as searching the index.
    </p>

    <p>
      Also, if this made a difference in your dev life, consider (temporarily,
      even?) becoming a patron of my work over on
      <a href="https://www.patreon.com/bezierinfo">my Patreon page</a>, or send
      a one-time donation to
      <a
        href="https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=QPRDLNGDANJSW"
        >help keep this project, and others like it, funded</a
      >. Any amount is appreciated!
    </p>

    <section id="toc">
    ${toc}
    </section>

    ${pageCode}

    <!-- ===================code syntax highlighting====================== -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
      hljs.highlightAll({ language: "javascript" });
    </script>
  </body>
</html>`
  );
}
