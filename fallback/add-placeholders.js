// This code is currently tailored for this repo.
import fs from "node:fs";
import http from "node:http";
import { createHash } from "crypto";
import { sep, posix } from "node:path";
import { firefox } from "@playwright/test";
import { format } from "prettier";

const __dirname = process.cwd();

let argPos = -1;
let outputDir = ``;
let overwrite = false;

argPos = process.argv.indexOf(`--outdir`);
if (argPos > -1) {
  outputDir = process.argv[argPos + 1] + `/`;
  process.argv.splice(argPos, 2);
}

argPos = process.argv.indexOf(`--write`);
if (argPos > -1) {
  overwrite = true;
  process.argv.splice(argPos, 1);
}

// Get the input filename
argPos = process.argv.findIndex((v) => import.meta.filename.includes(v));
let infile = process.argv[argPos + 1];
if (!infile) {
  console.error(
    `ERROR: input filename missing. Run as: node add-placeholders inputfilename`
  );
  process.exit(1);
}
infile = infile.split(sep).join(posix.sep);
if (!fs.existsSync(infile)) {
  console.error(
    `ERROR: Input file does not exist (check relative location and filename case).`
  );
  process.exit(2);
}

// Read our input file and find all <graphics-element> blocks
console.log(`Reading ${infile}...`);
let data = fs.readFileSync(infile).toString(`utf-8`);
let start = 0;
const blocks = [];
while (start !== -1) {
  start = data.indexOf(`<graphics-element`, start + 1);
  if (start === -1) break;
  const end = data.indexOf(`</graphics-element>`, start);
  if (end === -1) {
    console.error(
      `ERROR: missing closing tag for opening <graphics-element> at position ${start}.`
    );
  }
  const block = data.substring(start, end + 19);
  blocks.push(block);
}
if (blocks.length === 0) {
  console.log(`Done: there was nothing to replace in your file`);
  process.exit(3);
}

console.log(`Found ${blocks.length} graphics elements.`);

// Start a server
const server = http.createServer((req, res) => {
  const file = __dirname + req.url;
  // console.log(file);
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

// Start a headless browser
const browser = await firefox.launch();

// Process all blocks
let blockNum = 1;
for (let block of blocks) await processBlock(block, blockNum++);

// Shut down the headless browser and server before exit
console.log(`\nshutting down server and browser.`);
await browser.close();
server.close();

// And if we were told to update the input file, do so.
if (overwrite) {
  console.log(`Got --write flag: rewriting input.`);
  data = await format(data, { parser: `html` });
  fs.writeFileSync(infile, data);
}

console.log(`Finished generating fallback images.`);

// ----------------------------------------------

/**
 * Generate temporary HTML pages for each block, screenshot the
 * graphics element, then delete the temporary HTML file again.
 */
async function processBlock(block, blockNum) {
  console.log(`\nProcessing block ${blockNum}.`);

  // Strip the pre-existing fallback <img> (if there is one)
  let newBlock = await format(block.replace(/<img[^>]+>/, ``), {
    parser: `html`,
  });

  // First, create a hash for this block, ignoring any preexisting
  // fallback image, and reformatted using prettier to make sure the
  // hash is the same even if the formatting (but not content) changed.
  const hash = createHash(`md5`).update(newBlock).digest(`hex`);

  // Then, create a temporary html file...
  const htmlPage = `<!doctype html><html><head><meta charset="utf-8" />
<script type="module" src="./dist/graphics-element.js" async></script>
<link rel="stylesheet" href="./dist/graphics-element.css" async />
</head><body>${newBlock}</body></html>`;
  const tempFile = hash + `.html`;
  console.log(`- creating ${tempFile}`);
  fs.writeFileSync(tempFile, htmlPage);

  // ...load that in the browser...
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/${tempFile}`);
  await page.waitForTimeout(500);
  const title = await page.locator("graphics-element").getAttribute(`title`);
  if (!title) {
    console.warn(`- ***warning*** missing "title" attribute!`);
  } else {
    console.log(`- loading "${title}".`);
  }
  for (let l of await page.locator("graphics-element > *:not(canvas)").all()) {
    l.evaluate((e) => {
      e.style.opacity = 0.25;
      e.style.filter = `grayscale(1)`;
    });
  }

  // ...generate the fallback image...
  const imageFile = outputDir + hash + `.png`;
  console.log(`- writing screenshot to ${imageFile}`);
  await page.locator("graphics-element").screenshot({ path: imageFile });
  console.log(`- removing ${tempFile}`);
  fs.unlinkSync(tempFile);

  // ...add the fallback image...
  const { width, height } = await page
    .locator("graphics-element")
    .boundingBox();
  newBlock = newBlock.replace(
    `>`,
    `><img
      class="fallback"
      src="./${imageFile}"
      width="${width}px"
      height="${height | 0}px"
      title="This is a placeholder image because JavaScript is disabled"
    >`
  );
  data = data.replace(block, newBlock);
}
