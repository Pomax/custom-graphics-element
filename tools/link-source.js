import fs from "node:fs";

function base64(data) {
  const bytes = new TextEncoder().encode(data);
  let binString = ``;
  for (let i = 0; i < bytes.length; i += 500) {
    binString += String.fromCodePoint(...bytes.slice(i, i + 500));
  }
  return btoa(binString);
}

// Get the base API file
let api = fs
  .readFileSync(`./graphics-element/graphics-api.js`)
  .toString(`utf-8`);

// inject the const/let that we need up front:
api += fs.readFileSync(`./graphics-element/api/constants.js`).toString(`utf-8`);

// Add in all the distinct parts
const baseDir = `./graphics-element/api/parts`;
fs.readdirSync(baseDir).forEach((filename) => {
  api += fs.readFileSync(`${baseDir}/${filename}`).toString(`utf-8`);
});

// Then write that out as the compiled library
const lib = fs.readFileSync(`./dist/graphics-element.js`).toString(`utf-8`);
const updated = lib.replace(`GRAPHICS_API_PLACEHOLDER`, base64(api));
fs.writeFileSync(`./dist/graphics-element.js`, updated, `utf-8`);
