import { readdirSync, watch } from "fs";
import { execSync } from "child_process";

console.log(`
    ==========================
    Running in file-watch mode
    ==========================
`);

const dirname = `graphics-element/api/parts`;
const files = readdirSync(dirname);
let recompiling = false;
files.forEach((filename) => {
  console.log(`watching ${filename}`);
  watch(`${dirname}/${filename}`, () => {
    if (recompiling) return;
    recompiling = true;
    console.log(`Recompiling... (change to ${filename})`);
    execSync(`npm run build`);
    setTimeout(() => (recompiling = false), 1000);
  });
});
