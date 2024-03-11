/**
 * Turn a reasonably well JSDoc'd JavaScript file into a typescript declarations.
 */
import fs from "node:fs";
import { glob } from "glob";
import { format } from "prettier";
import { marked } from "marked";

const declarations = {};
const examples = {};

// ---------------------------------DFA---------------------------------

/**
 * Find the start of a comment block, and then parse the subsequent comment out.
 */
function parse(stream, blocks) {
  // And do that for as long as there's tokens to consume.
  while (stream.length) {
    const token = stream.shift();
    if (token === `/`) {
      const [a, b] = stream.slice(0, 2);
      if (a === `*` && b === `*`) {
        parseComment(stream, blocks);
      }
    }
  }
}

/**
 * parse a comment, as well as the subsequent function name that it's for.
 */
function parseComment(stream, blocks) {
  let comment = [];
  do {
    // end of comment?
    const [a, b] = stream.slice(0, 2);
    if (a === `*` && b === `/`) {
      stream.splice(0, 2);
      blocks.push({
        comment: [`/`, ...comment, `*`, `/`],
        // get the function name that this comment is documentation for
        fname: parseFName(stream),
      });
      return;
    }
    comment.push(stream.shift());
  } while (stream.length);
}

/**
 * parse a function name out of the stream.
 */
function parseFName(stream) {
  // find "function" and then parse out the subsequent name
  const target = `function`;
  const len = target.length;
  let fname = ``;
  while (stream[0] !== target[0]) stream.shift();
  if (stream.slice(0, len).join(``) === target) {
    stream.splice(0, len);
    // and the name is just "anything up to the opening parenthesis":
    while (stream[0] !== `(`) fname += stream.shift();
  }
  return fname.trim();
}

// ---------------------------------PROCESSING---------------------------------

/**
 * Read in a file and abstract its declarations by looking at the JSDoc
 * and ONLY at the JSDoc. The function signature is IRRELEVANT if there
 * are JSDocs that describe the input and output.
 */
function fileToDTS(filename) {
  const stream = Array.from(fs.readFileSync(filename).toString(`utf-8`));
  const blocks = [];
  parse(stream, blocks);

  blocks.forEach((block) => {
    const { fname, comment } = block;

    // derive the JSDoc-less comment from the comment stream.
    let commentString = comment.join(``);
    if (commentString.indexOf(` @`) > -1) {
      commentString =
        commentString.substring(0, commentString.indexOf(` @`)) + `/`;
    }
    if (commentString === `/`) return;

    // extract the example code
    examples[fname] = getExamples(fname, comment.slice());

    // Then get the JSDoc @things from the comment stream.
    const params = getParamsAndReturn(fname, comment);
    declarations[fname] = {
      comment: commentString,
      declarations: [],
      see: [],
    };

    params.forEach((set) => {
      const { returnType, see, ...params } = set;
      const parameters = Object.entries(params)
        .map(([name, param]) => `${name}: ${param.type}`)
        .join(`, `);
      declarations[fname].declarations.push(
        `declare function ${fname}(${parameters}): ${returnType.type};`
      );
      if (see) declarations[fname].see.push(...see);
    });
  });
  return blocks;
}

/**
 * Get all examples from a comment block
 */
function getExamples(fname, comment) {
  comment = comment.join(``);
  const description = comment
    .substring(0, comment.indexOf(`Example`))
    .split(`\n`)
    .map((l) => l.trim().replace(/^(\/\*)?\*/, ""))
    .join(`\n`)
    .trim();
  const blocks = comment
    .match(/<graphics-element>[\s\S]+?<\/graphics-element>/g)
    ?.map((block) =>
      block
        .split(`\n`)
        .map((l) => l.trim().replace(/^\* /, ""))
        .join(`\n`)
        .trim()
    );

  return { description, blocks: blocks ?? [] };
}

/**
 * Get all JSDoc @param and @returns values, organized
 * in sets, as one function might have multiple signatures.
 */
function getParamsAndReturn(fname, comment) {
  const params = [];
  const newSet = () => ({ returnType: { type: `void` }, __updated: false });
  const saveSet = () => {
    delete set.__updated;
    params.push(set);
    set = newSet();
  };

  // The first set is always "updated" so that even if there
  // are no annotations at all, we have typing.
  let set = newSet();
  set.__updated = true;

  while (comment.length) {
    // find a JSDoc thing
    while (comment.length && comment[0] !== `@`) {
      comment.shift();
    }
    if (comment.length === 0) break;

    // read the whole line
    let line = comment.shift();
    while (comment.length && comment[0] !== `\n`) {
      line += comment.shift();
    }
    if (comment.length === 0) break;

    // Figure out who annotation we're dealing with
    const [_, op] = line.match(/(@[^\s]+)/);
    try {
      // parameter?
      if (op === `@param`) {
        const [_, type, name, __, desc] = line.match(
          /@param\s+{([^}]+)}\s+(\S+)(\s+([^\n]+))?/
        );
        set.__updated = true;
        set[name] = { type, desc: desc ?? `` };
      }
      // reference to another function?
      else if (op === `@see`) {
        const [_, ref] = line.match(/@see\s+{@link\s+(\S+)}/);
        set.see ??= [];
        set.see.push(ref);
      }
      // return type?
      else if (op === `@returns`) {
        const [_, type, __, desc] = line.match(
          /@returns\s+(\S+)(\s+([^\n]+))?/
        );
        set.returnType = { type, desc: desc ?? `` };
        saveSet();
      }
    } catch (e) {
      console.error(e);
      console.log(`line:`, line);
    }

    // Is there a param set overload without a return? If
    // so, there'll be an "empty" line between @param sets.
    const next = comment.slice(0, 4).join(``);
    if (next === `\n *\n` && set.__updated) {
      // FIXME: This is somewhat brittle and relies on indent. That's
      //        fine for now, but may be a promblem in the future.
      saveSet();
    }
  }

  // If we have a dangling set with updates, save that.
  if (set.__updated) {
    saveSet();
  }

  return params;
}

// ---------------------------------HTML---------------------------------

/**
 * Convert "code from the comment block" into proper source code.
 */
async function cleanUpCode(code) {
  return await format(
    code
      .replace(/\<\/?graphics-[^>]+\>/g, ``)
      .split(`\n`)
      .map((l) => l.replace(/^(\s*\*)/, ``).replace(/\*+$/, ``))
      .join(`\n`)
      .trim(),
    { semi: true, parser: "babel" }
  );
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

// ---------------------------------MAIN ENTRY POINT---------------------------------

/**
 * Abstract declarations and comments:
 */
const fileList = await glob(`./graphics-element/api/parts/[!_]*.js`);
fileList.sort().forEach((filename) => fileToDTS(filename));

/**
 * Then create our graphics-element.d.ts file.
 */
fs.writeFileSync(
  `./dist/graphics-element.d.ts`,
  Object.entries(declarations)
    .map(([key, value]) => {
      return (
        value.comment + `\n` + value.declarations.map((e) => e.type).join(`\n`)
      );
    })
    .join(`\n`)
);

/**
 * form documentation HTML using  the `declarations` and `examples` data.
 */
const pageCode = (
  await Promise.all(
    Object.entries(examples).map(async ([key, value]) => {
      // Include the call signature(s)
      const signatures = await declarations[key].declarations
        .map((v) => {
          const signature = v
            .replace(`declare function `, ``)
            .replace(`: void`, ``)
            .replace(`;`, ``);
          return `<li><code>${signature}</code></li>`;
        })
        .join(`\n`);

      // With the example as both a graphics element and <pre>'d source code.
      const gfxAndCode = (
        await Promise.all(
          value.blocks.map(async (block) => {
            const code = await cleanUpCode(block);
            return `<!-- prettier-ignore -->
          <graphics-element width="200px" height="200px">
            <graphics-source>\n${code}\n</graphics-source>
          </graphics-element>
          <pre>${escape(code)}</pre>`;
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
          <ul>${signatures}</ul>
          <h3>Description</h3>
          ${markdownToHTML(value.description)}
          <h3>Examples</h3>
          ${gfxAndCode}
          ${seeAlso}
        </section>
    `;
    })
  )
).join(`\n\n`);

const toc =
  `<ul>` +
  Object.keys(declarations)
    .sort()
    .map((v) => `<li><a href="#${v}">${v}</a></li>`)
    .join(``) +
  `</ul>`;

/**
 * Create a test.html, let's see what this looks like
 */
fs.writeFileSync(
  `test.html`,
  `<doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>example test</title>
    <script type="module" src="dist/graphics-element.js" async></script>
    <link rel="stylesheet" href="dist/graphics-element.css" async />
    <style>
      body {
        font-family: Helvetica;
        width: 800px;
        margin: auto;
        border: 1px solid black;
        border-width: 0px 1px;
        padding: 0 1rem;
        h1 {
          background: #f8f8f8;
          margin: 0 -1rem;
          padding: 0 1rem;
          span {
            vertical-align: -0.05em;
          }
        }
        #toc {
          column-count: 3;
          padding: 1em 0 2em;
          ul {
            margin: 0;
          }
        }
        a {
          &:link,
          &:visited,
          &:active,
          &:hover,
          &:focus {
            color: #06c;
          }
          text-decoration: none;
          &[href="#top"] {
            float: right;
            font-size: 0.8em;
            margin-top: 0.2em;
          }
        }
        graphics-element {
          min-width: 200px;
          min-height: 200px;
        }
      }
    </style>
  </head>
  <body>
  <h1 id="top" style="text-align: center; font-size: 2.5em">The <span>&lt;</span>graphics-element<span>&gt;</span> API</h1>
  <p>
      This is the API documentation for &lt;graphics-element&gt; source code,
      which at its code is simply plain JavaScript with a bunch of extra global
      constants and functions to allow you to quickly but cleanly get (interactive,
      and animated) graphics onto a page using the native web stack instead of
      needing some kind of build system.
  </p>
  <section id="toc">
  ${toc}
  </section>
  ${pageCode}
  </body>
</html>`
);
