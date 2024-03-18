/**
 * Turn a reasonably well JSDoc'd JavaScript file into a typescript declarations.
 */
import fs from "node:fs";
import { sep } from "node:path";
import { glob } from "glob";
import { parse } from "./parser.js";
import { formAPIPage } from "./html.js";

/**
 * Read in a file and abstract its declarations by looking at the JSDoc
 * and ONLY at the JSDoc. The function signature is IRRELEVANT if there
 * are JSDocs that describe the input and output.
 */
function fileToDTS(filename) {
  const stream = Array.from(fs.readFileSync(filename).toString(`utf-8`));
  const blocks = [];
  parse(stream, blocks);

  const namespace = filename
    .substring(filename.lastIndexOf(sep) + 1)
    .split(`.`)[0];

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
    metadata[fname] = getMetaData(fname, comment.slice());

    // Then get the JSDoc @things from the comment stream.
    const params = getParamsAndReturn(fname, comment);

    declarations[fname] = {
      fname,
      namespace,
      comment: commentString,
      params,
      declarations: [],
      see: params.see ?? [],
    };

    params.forEach((set) => {
      const { returnType, ...params } = set;
      let parameters = Object.entries(params);

      // Is this a constant?
      if (parameters.length === 1 && params[parameters[0][0]].constant) {
        const [cname, { type }] = parameters[0];
        declarations[fname].declarations.push(
          `declare const ${cname}: ${type};`
        );
      }

      // If not, we assume it's a function
      else {
        parameters = parameters
          .map(([name, param]) => `${name}: ${param.type}`)
          .join(`, `);
        declarations[fname].declarations.push(
          `declare function ${fname}(${parameters}): ${returnType.type};`
        );
      }
    });
  });
  return blocks;
}

/**
 * Get all examples from a comment block
 */
function getMetaData(fname, comment) {
  comment = comment.join(``);

  // Where does the description... you know... end?
  let lastIndex = -1;
  const [v1, v2, v3, v4, v5] = [
    comment.indexOf(`Example`),
    comment.indexOf(`@constant`),
    comment.indexOf(`@param`),
    comment.indexOf(`@returns`),
    comment.indexOf(`@see`),
    comment.indexOf(`*/`),
  ];
  lastIndex = Math.min(...[v1, v2, v3, v4, v5].filter((v) => v > -1));

  const description = comment
    .substring(0, lastIndex)
    .split(`\n`)
    .map((l) => l.trim().replace(/^(\/\*)?\*/, ``))
    .join(`\n`)
    .trim();

  const blocks = comment
    .match(/<graphics-element>[\s\S]+?<\/graphics-element>/g)
    ?.map((block) =>
      block
        .split(`\n`)
        .map((l) => l.trim().replace(/^\* /, ``))
        .join(`\n`)
        .trim()
    );

  return { description, examples: blocks ?? [] };
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
      // constant?
      if (op === `@constant`) {
        const [_, type] = line.match(/@constant\s+{([^}]+)}/);
        set[fname] = { constant: true, type };
        set.__updated = true;
      }

      // parameter?
      if (op === `@param`) {
        const [_, type, name, __, desc] = line.match(
          /@param\s+{([^}]+)}\s+(\S+)(\s+([^\n]+))?/
        );
        set[name] = { type, desc: desc ?? `` };
        set.__updated = true;
      }

      // reference to another function?
      else if (op === `@see`) {
        const [_, ref] = line.match(/@see\s+{@link\s+(\S+)}/);
        params.see ??= [];
        params.see.push(ref);
      }

      // return type?
      else if (op === `@returns`) {
        const [_, type, __, desc] = line.match(
          /@returns\s+{(\S+)}(\s+([^\n]+))?/
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
      //        fine for now, but may be a problem in the future.
      saveSet();
    }
  }

  // If we have a dangling set with updates, save that.
  if (set.__updated) {
    saveSet();
  }

  return params;
}

// ---------------------------------MAIN ENTRY POINT---------------------------------

const declarations = {};
const metadata = {};

const fileList = await glob(`./graphics-element/api/parts/[!_]*.js`);
[`./graphics-element/api/constants.js`, ...fileList.sort()].forEach(
  (filename) => fileToDTS(filename)
);

fs.writeFileSync(
  `./dist/graphics-element.d.ts`,
  Object.entries(declarations)
    .map(([key, value]) => {
      return (
        blockComment(key, metadata[key].description) +
        `\n` +
        value.declarations.join(`\n`)
      );
    })
    .join(`\n`)
);

await formAPIPage(declarations, metadata);

function blockComment(key, text) {
  return `/**
${text
  .split(`\n`)
  .map((l) => ` * ` + l)
  .join(`\n`)}
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#${key}
 */`;
}
