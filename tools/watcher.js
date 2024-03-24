import { readdirSync, watch } from "fs";
import { execSync } from "child_process";

console.log(`
    ==========================
    Running in file-watch mode
    ==========================
`);

const dirname = `graphics-element/api/parts`;
const files = readdirSync(dirname);
files.forEach((filename) => {
  console.log(`watching ${filename}`);
  watch(`${dirname}/${filename}`, () => {
    // console.log(`change to ${filename}`);
    execSync(`npm run build`);
    // console.log(`[Watch] ${new Date().toISOString()} Recompile finished`);
  });
});
