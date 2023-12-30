import fs from "node:fs";
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
