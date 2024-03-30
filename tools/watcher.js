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
  if (recompiling) return;
  if (changeStack.includes(filename)) return;
  changeStack.push(filename);
}

function recompile() {
  if (!changeStack.length) return;
  if (recompiling) return;
  recompiling = true;
  console.log(`Recompiling (changes found in ${changeStack.join(`,`)})`);
  changeStack.splice(0, changeStack.length);
  execSync(`npm run build`);
  setTimeout(() => (recompiling = false), 250);
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
