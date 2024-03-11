/**
 * Turn a reasonably well JSDoc'd JavaScript file into a typescript declarations.
 */
import fs from "node:fs";
import path from "node:path";

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
    commentString =
      commentString.substring(0, commentString.indexOf(` @`)) + `/`;
    if (commentString === `/`) return;
    // Then get the JSDoc @things from the comment stream.
    const params = getParamsAndReturn(fname, comment);
    console.log(commentString);
    params.forEach((set) => {
      const { returnType, ...params } = set;
      const parameters = Object.entries(params)
        .map(([key, value]) => `${key}: ${value}`)
        .join(`, `);
      console.log(`declare function ${fname}(${parameters}): ${returnType};`);
    });
  });
  return blocks;
}

function getParamsAndReturn(fname, comment) {
  const params = [];
  let set = {};
  while (comment.length) {
    // find a JSDoc thing
    while (comment.length && comment[0] !== `@`) {
      comment.shift();
    }
    if (comment.length === 0) break;
    // reade the whole line
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
      set[name] = type;
    } else if (op === `@return`) {
      const [_, __, type] = line.match(/(@[^\s]+)\s+(\S+)/);
      set.returnType = type;
      params.push(set);
      set = {};
    }
  }

  return params;
}

import { glob } from "glob";
const posixPath = process.argv[2].split(path.sep).join(path.posix.sep);
const fileList = await glob(posixPath);

fileList.forEach((filename) => fileToDTS(filename));
