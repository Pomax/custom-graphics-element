import fs from "node:fs";
const { version } = JSON.parse(fs.readFileSync(`./package.json`));
const index = fs.readFileSync(`./index.html`).toString();
const newIndex = index
  .replaceAll(
    /graphics-element.*\.js(['"`])/g,
    `graphics-element-${version}.js$1`
  )
  .replaceAll(
    /graphics-element.*\.css(['"`])/g,
    `graphics-element-${version}.css$1`
  );

  fs.writeFileSync(`./index.html`, newIndex);
