import { readdirSync, watch } from "fs";
import { execSync } from "child_process";

console.log(`
    ==========================
    Running in file-watch mode
    ==========================
`);

const changeStack = [];
let recompiling = false;

function addToStack(filename) {
  if (changeStack.includes(filename)) return;
  changeStack.push(filename);
}

function recompile(changeDuringCompile = false) {
  if (!changeStack.length) return;
  if (recompiling) return;
  recompiling = true;
  if (changeDuringCompile) {
    console.log(
      `File changes found during compile, re-recompiling (${changeStack.join(`,`)})`
    );
  } else {
    console.log(`Recompiling (changes found in ${changeStack.join(`,`)})`);
  }
  console.log(changeStack);
  changeStack.splice(0, changeStack.length);
  execSync(`npm run build`);
  setTimeout(() => {
    recompiling = false;
    if (!changeDuringCompile && changeStack.length > 0) recompile(true);
  }, 500);
}

const dirname = `graphics-element/api/parts`;
const files = readdirSync(dirname);

files.forEach((filename) => {
  console.log(`watching ${filename}`);
  watch(`${dirname}/${filename}`, () => {
    addToStack(filename);
    recompile();
  });
});

// And then the other important files:
[
  `graphics-element/graphics-api.js`,
  `graphics-element/custom-element.js`,
  `graphics-element/graphics-element.js`,
].forEach((filename) =>
  watch(filename, () => {
    addToStack(filename);
    recompile();
  })
);
