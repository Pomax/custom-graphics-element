/**
 * This is a simple infinite loop protector that takes code-as-string,
 * and replaces all `for`, `while`, and `do...while` loops with IIFE
 * wrappers that have a break counter. E.g. it replaces this:
 *
 *   for (...) {
 *     // ...body goes here...
 *   }
 *
 * with this:
 *
 *   ((__break_counter = 0) => {
 *     for (...) {
 *       if (__break_counter++ > 1000) {
 *         throw new Error(`Potentially infinite loop detected`);
 *       }
 *       // ...body goes here...
 *     }
 *   })();
 */
const errorMessage = `Potentially infinite loop detected.`;
const loopStart = /\b(for|while)[\r\n\s]*\([^\)]+\)[\r\n\s]*{/;
const doLoopStart = /\bdo[\r\n\s]*{/;
const doLoopChunk =
  /}(\s*(\/\/)[^\n\r]*[\r\n])?[\r\n\s]*while[\r\n\s]*\([^\)]+\)([\r\n\s]*;)?/;

/**
 * Walk through a string of source code, and wrap all `for`, `while`, and
 * `do...while` in IIFE that count the number of iterations and throw if
 * that number gets too high.
 *
 * Note that this uses an ESM export, but you can trivially rewrite this
 * to `module.exports = loopGuard(...)` if you need legacy CJS, or
 * `window.loopGuard = function loopGuard(...)` if you need a browser
 * global (but neither should be necessary anymore at time of posting).
 *
 * @param {String} code The source code to "safe-i-fy".
 * @param {number?} loopLimit The iteration count threshold for throwing.
 * @param {number?} blockLimit The replacement count threshold, after which this function decides it's probably in an infinite loop, itself.
 * @returns {String} The code with all loop blocks wrapped in safety IIFE.
 */
export function loopGuard(code, loopLimit = 1000, blockLimit = 1000) {
  let ptr = 0;
  let iterations = 0;
  while (ptr < code.length) {
    if (iterations++ > blockLimit) throw new Error(errorMessage);

    const codeLength = code.length;
    let block = ``;
    let loop = ptr + code.substring(ptr).search(loopStart);
    let doLoop = ptr + code.substring(ptr).search(doLoopStart);

    // do the numbers make sense?
    if (loop < ptr) loop = codeLength;
    if (doLoop < ptr) doLoop = codeLength;
    if (loop === codeLength && doLoop === codeLength) return code;

    // if we ge there, we have a source block to extract:
    let nextPtr = -1;
    if (loop < codeLength && loop <= doLoop) {
      nextPtr = loop;
      block = getLoopBlock(code, loop);
    } else if (doLoop < codeLength) {
      nextPtr = doLoop;
      block = getDoLoopBlock(code, doLoop);
    }

    // Quick sanity check:
    if (block === `` || nextPtr === -1) return code;

    // Replace the block's code and increment the pointer so that it points
    // to just after the IIFE's throw instruction. Note that we don't increment
    // it by wrapped.length, because the code we just wrapped might have nested
    // loops, and we don't want to skip those.
    const wrapped = wrap(block, loopLimit);
    code = code.substring(0, ptr) + code.substring(ptr).replace(block, wrapped);
    ptr = nextPtr + wrapped.indexOf(errorMessage) + errorMessage.length + 6;
  }

  return code;
}

/**
 * In order to find the full for/while block, we need to start at
 * [position], and then start tracking curly braces until we're back
 * at depth = 0.
 */
function getLoopBlock(code, position = 0) {
  let char = ``;
  let depth = 1;
  let pos = code.indexOf(`{`, position) + 1;
  while (depth > 0 && position < code.length) {
    char = code[pos];
    if (char === `{`) depth++;
    else if (char === `}`) depth--;
    pos++;
  }
  if (pos >= code.length) {
    throw new Error(`Parse error: source code end prematurely.`);
  }
  return code.substring(position, pos);
}

/**
 * Extract everything from [position] up to and including the final
 * "while (...)". Note that we do not allow comments between the do's
 * body and the while conditional. That is: you can do it, but then
 * we won't guard your loop.
 */
function getDoLoopBlock(code, position = 0) {
  const chunk = code.substring(position);
  const block = chunk.match(doLoopChunk)[0];
  const end = chunk.indexOf(block) + block.length;
  return chunk.substring(0, end);
}

/**
 * wrap a block of code in the break counter IIFE, breaking out of the
 * loop by way of a throw if more than [loopLimit] iterations occur.
 */
function wrap(block, loopLimit = 1000) {
  return `((__break__counter=0) => {
${block.replace(
  `{`,
  `{
  if (__break__counter++ > ${loopLimit}) {
    throw new Error("${errorMessage}");
  }`
)}
})();`;
}
