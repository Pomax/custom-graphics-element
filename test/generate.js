// This code is currently tailored for this repo.
import fs from "node:fs";
import { sep, posix } from "node:path";
import { firefox } from "@playwright/test";
import { decode64 } from "../graphics-element/api/util/utils.js";

// Get our HTML source, either directly *from* source using an
// --html flag to pass base64 encoded HTML, or by pointing to
// a source file using --file.
//
// if --html is used, --out must be used to specify the output
// filename. When --file is used, the output name is automatically
// derived from the input name.

let argPos;
let htmlCode = false;
let imageFile = `screenshot.png`;

argPos = process.argv.indexOf(`--html`);
if (argPos > -1) {
  htmlCode = process.argv[argPos + 1];
  if (!htmlCode) process.exit(1);
  htmlCode = decode64(htmlCode);
}

argPos = process.argv.indexOf(`--file`);
if (argPos > -1) {
  const infile = process.argv[argPos + 1];
  if (!infile || !fs.existsSync(infile)) {
    console.error(`Invalid file indicated by --file`);
    process.exit(2);
  }
  let sourceCode = fs.readFileSync(infile).toString(`utf-8`);
  if (!sourceCode) {
    console.error(`Cannot load soure code from ${infile}`);
    process.exit(3);
  }
  htmlCode = `<graphics-element>
  <graphics-source>
    ${sourceCode}
  </graphics-source>
</graphics-element>
`;
  imageFile = infile.split(sep).join(posix.sep);
  imageFile = imageFile.substring(
    imageFile.lastIndexOf(posix.sep) + 1,
    imageFile.length - 3
  );
  imageFile += `.graphics-element.png`;
} else {
  argPos = process.argv.indexOf(`--out`);
  imageFile = process.argv[argPos + 1];
  if (!imageFile) {
    console.log(`The --html flag also requires an --out flag`);
    process.exit(4);
  }
}

// Create a temporary HTML file that the sever can load
const htmlPage = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Generator temp page</title>
    <script type="module" src="../dist/graphics-element.js" async></script>
    <link rel="stylesheet" href="../dist/graphics-element.css" async />
  </head>
  <body>
    ${htmlCode}
  </body>
</html>`;
const tempFile = Math.random().toFixed(10).substring(2) + `.html`;
fs.writeFileSync(tempFile, htmlPage);

// Then load that file in a headless Firefox and take a screenshot
const browser = await firefox.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:3000/test/${tempFile}`);
await page.locator("graphics-element canvas").screenshot({ path: imageFile });

// Then shut down the browser, and clean up the temp file.
await browser.close();
fs.unlinkSync(tempFile);
