import fs from "node:fs";
const { version } = JSON.parse(fs.readFileSync(`./package.json`));
const api = fs
  .readFileSync(`./graphics-element/graphics-api.js`)
  .toString(`utf-8`);
const lib = fs.readFileSync(`./dist/graphics-element.js`).toString(`utf-8`);

function base64(data) {
  const bytes = new TextEncoder().encode(data);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

const updated = lib.replace(`THIS_IS_A_PLACEHOLDER`, base64(api));
fs.writeFileSync(`./dist/graphics-element.js`, updated, `utf-8`);

fs.renameSync(
  `./dist/graphics-element.js`,
  `./dist/graphics-element-${version}.js`
);
fs.renameSync(
  `./dist/graphics-element.css`,
  `./dist/graphics-element-${version}.css`
);