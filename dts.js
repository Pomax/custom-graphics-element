/**
 * Turn a reasonably well JSDoc'd JavaScript file into a typescript declarations.
 */
import fs from "node:fs";
import { glob } from "glob";

const declarations = {};
const examples = {};

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

// -----------------

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
    };
    params.forEach((set) => {
      const { returnType, ...params } = set;
      const parameters = Object.entries(params)
        .map(([key, value]) => `${key}: ${value}`)
        .join(`, `);
      declarations[fname].declarations.push(
        `declare function ${fname}(${parameters}): ${returnType};`
      );
    });
  });
  return blocks;
}

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

function getParamsAndReturn(fname, comment) {
  const params = [];
  const newSet = () => ({ returnType: `void`, __updated: false });
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
    const [_, op] = line.match(/(@[^\s]+)/);
    if (op === `@param`) {
      const [_, __, type, name, ___, desc] = line.match(
        /(@[^\s]+)\s+{([^}]+)}\s+(\S+)(\s+([^\n]+))?/
      );
      set.__updated = true;
      set[name] = type;
    } else if (op === `@return`) {
      const [_, __, type] = line.match(/(@[^\s]+)\s+(\S+)/);
      set.returnType = type;
      saveSet();
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

// Let's go. And not in package.json because the glob will trigger zsh, even in quotes.
const fileList = await glob(`./graphics-element/api/parts/[!_]*.js`);
fileList.sort().forEach((filename) => fileToDTS(filename));

fs.writeFileSync(
  `./dist/graphics-element.d.ts`,
  Object.entries(declarations)
    .map(([key, value]) => {
      return value.comment + `\n` + value.declarations.join(`\n`);
    })
    .join(`\n`)
);

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
        width: 800px;
        margin: auto;
        border: 1px solid black;
        border-width: 0px 1px;
        padding: 0 1rem;
      }
      h1 {
        background: #F8F8F8;
        margin: 0 -1rem;
        padding: 0 1rem;
      }
    </style>
  </head>
  <body>
  ${Object.entries(examples)
    .map(([key, value]) => {
      const signatures = declarations[key].declarations
        .map((v) => {
          const signature = v
            .replace(`declare function `, ``)
            .replace(`: void`, ``)
            .replace(`;`, ``);
          return `<li><code>${signature}</code></li>`;
        })
        .join(`\n`);

      return `
        <h1>${key}</h1>
        <ul>${signatures}</ul>
        <p>${value.description}</p>
        ${value.blocks
          .map((block) => {
            const code = block
              .replace(/\<\/?graphics-[^>]+\>/g, ``)
              .replace(/\n    /g, `\n`)
              .trim();
            return `
            ${block}
            <pre>${escape(code)}</pre>
          `;
          })
          .join(`\n\n`)}
      `;
    })
    .join(`\n\n`)}
  </body>
</html>`
);
