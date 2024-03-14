/**
 * Find the start of a comment block, and then parse the subsequent comment out.
 */
export function parse(stream, blocks) {
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
        // get the next marker, which can be either an explicit function,
        // or a constant inside a destructuring, which will just be a
        // bare name.
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
  while (stream[0].trim() === "") stream.shift();
  const copy = stream.slice(0, stream.indexOf(`\n`)).join(``);

  const functionMatch = copy.match(/function (\S+)\(/)?.[1];
  const varMatch = copy.match(/(const|let) ([^\s;]+)/)?.[2];
  const destructureMatch = copy.match(/^\s*(\S+),/)?.[1];
  const renamedMatch = copy.match(/^\s*\S+\s*:\s*(\S+),/)?.[1];
  const fname = functionMatch ?? varMatch ?? destructureMatch ?? renamedMatch;

  stream.splice(0, copy.indexOf(fname) + fname.length);
  return fname.trim();
}
