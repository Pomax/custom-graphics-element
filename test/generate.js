// This code is currently tailored for this repo.
import fs from "node:fs";
import http from "node:http";
import { sep, posix } from "node:path";
import { firefox } from "@playwright/test";

// Unicode-aware base64 decoder:
function decode64(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 *  Get our HTML source, either directly *from* source using an
 *  --html flag to pass base64 encoded HTML, or by pointing to
 *  a source file using --file.
 *
 *  If --html is used, --out must be used to specify the output
 *  filename. When --file is used, the output name is automatically
 *  derived from the input name.
 *
 *  To generate just the canvas, add --canvas-only
 */

let argPos;
let htmlCode = false;
let imageFile = `screenshot.png`;

if (!process.argv.includes(`--html`) && !process.argv.includes(`--file`)) {
  console.error(
    `Error: missing --html <base64> --out <filename> or --file <filename> [...additional]`
  );
  process.exit(6);
}

// Are we dealing with a block of source code?
argPos = process.argv.indexOf(`--html`);
if (argPos > -1) {
  htmlCode = process.argv[argPos + 1];
  if (!htmlCode) process.exit(1);
  htmlCode = `<graphics-element><graphics-source>${decode64(htmlCode)}</graphics-source></graphics-element>`;
  argPos = process.argv.indexOf(`--out`);
  imageFile = process.argv[argPos + 1];
  if (!imageFile) {
    console.error(`Error: --html input requires --out <filename>, as well`);
    process.exit(4);
  }
}

// Are we dealing with src URLs?
argPos = process.argv.indexOf(`--file`);
if (argPos > -1) {
  const src = process.argv[argPos + 1];
  if (!src || !fs.existsSync(src)) {
    console.error(`Error: invalid file indicated by --file`);
    process.exit(2);
  }
  imageFile = src.split(sep).join(posix.sep);
  imageFile = imageFile.substring(
    imageFile.lastIndexOf(posix.sep) + 1,
    imageFile.length - 3
  );
  imageFile += `.graphics-element.png`;
  let next = 2;
  const additionalSources = [];
  while (process.argv[argPos + next]) {
    const src = process.argv[argPos + next++];
    if (src.startsWith(`--`)) break;
    if (!src || !fs.existsSync(src)) {
      console.error(`Error: invalid additional file indicated by --file`);
      process.exit(5);
    }
    additionalSources.push(src);
  }
  htmlCode = `<graphics-element src="${src}">${additionalSources.map((src) => `<source src="${src}" type="graphics-code">`)}</graphics-element>`;
}

// Are we capturing just the canvas?
const canvasOnly = process.argv.includes(`--canvas-only`);

// Alright, let's create a temporary HTML file that the sever can load...
const htmlPage = `<!doctype html><html><head><meta charset="utf-8" />
<script type="module" src="../dist/graphics-element.js" async></script>
<link rel="stylesheet" href="../dist/graphics-element.css" async />
</head><body>${htmlCode}</body></html>`;
const tempFile = Math.random().toFixed(10).substring(2) + `.html`;
fs.writeFileSync(tempFile, htmlPage);

// ...Which does require we have a server running...
const server = http.createServer((req, res) => {
  const file = import.meta.dirname + `/..` + req.url;
  if (fs.existsSync(file)) {
    let mime = `application/javascript`;
    if (file.endsWith(`html`)) mime = `text/html`;
    if (file.endsWith(`css`)) mime = `text/css`;
    res.writeHead(200, { "Content-Type": mime });
    res.write(fs.readFileSync(file).toString(`utf-8`));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
  }
  res.end();
});
server.listen(0);

// ...So that we can load that file in a headless Firefox and take a screenshot.
const browser = await firefox.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.address().port}/test/${tempFile}`);

// But we want the focus to be the canvas, so if we're also shooting the rest
// of the graphics-element, grayscale and fade everything that isn't the canvas:
for (let l of await page.locator("graphics-element *:not(canvas)").all()) {
  l.evaluate((e) => {
    e.style.opacity = 0.5;
    e.style.filter = `grayscale(1)`;
  });
}

// Click!
await page
  .locator(`graphics-element ${canvasOnly ? `canvas` : ``}`)
  .screenshot({ path: imageFile });

// And then we shut down the browser, shut down the server, and clean up the temp file.
await browser.close();
server.close();
fs.unlinkSync(tempFile);
