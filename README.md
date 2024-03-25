# The `<graphics-element>` custom HTML element

What if you could just put graphics on your web page, or in your web app, by just writing graphics JavaScript code and then using a &lt;graphics-element src="..."&gt; the same way you'd put regular JavaScript on a page using a &lt;script&gt; tag? As it turns out, that's not a "what if", it's something that the modern web supports, so if that's something you want, or need: maybe the &lt;graphics-element&gt; is for you!

- Visit [the website](https://pomax.github.io/custom-graphics-element)
- Read [the documentation](https://pomax.github.io/custom-graphics-element/docs.html)
- Check out [the API](https://pomax.github.io/custom-graphics-element/api.html)
- Try the [editor playground](https://pomax.github.io/custom-graphics-element/edit/)
- View the project [on GitHub](https://github.com/Pomax/custom-graphics-element) (wait, you're already here!)

Also, if this made a difference in your dev life, consider (temporarily, even?) becoming a patron of my work over on https://www.patreon.com/bezierinfo, or send a one-time donatation to [help keep this project funded](https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=QPRDLNGDANJSW). Any amount is appreciated!

## Contributing to the project

This project is more than happy to accept three forms of contributions:

- Monetary help, because open source is free, but developer time is not,
- Documentation help, because writing and maintaining documentation is hard, and
- Development help, because extra dev help is always appreciated.

The first can be either [a sponsorship on Patreon](https://www.patreon.com/Bezierinfo), or a one-time donation [using PayPal](https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=QPRDLNGDANJSW). Both are highly appreciated, and no amount is too small.

The latter two should be coordinated over on [the issue tracker](issues): if you want to help improve the docs or you want to get your hands dirty with some dev work, head on over to the issues and either comment on an existing issue (which is work I hope to eventually get done), or file a new issue if your idea isn't captured in any existing issue yet!

## Working on the code

If you'd like to help out, have a look at the list of ["good first issues"](https://github.com/Pomax/custom-graphics-element/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22), or if you're feeling more adventurous, have a look at the additional ["help-wanted issues"](https://github.com/Pomax/custom-graphics-element/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+-label%3A%22good+first+issue%22) and if any of those look like something you might want to tackle, post a comment to the one(s) that interest you!

If you want to work on the graphics-element code itself, you will need to have the latest version of Node.js installed.

### First-time setup

- clone this repository and `cd` into the resulting `custom-graphics-element` directory
- run `npm install`
- run `npx playwright install firefox`

Then run `npm test`, which should run through a build and then open your browser to http://localhost:3000, which should show the same website as can be found over on https://pomax.github.io/custom-graphics-element

### Dev commands

When working on the code, the following `npm` tasks are available:

- `npm test` runs everything.
- `npm run types` generates the `dist/graphics-element.d.ts` file, as well as the `api.html` file.
- `npm build` compiles the `dist/graphics-element.js` and `dist/graphics-element.css` files
- `npm run fallback` generates all the fallback images for every `<graphics-element>` on the website.

### What lives where

the main graphics-element code lives in the `graphics-element` directory, with the custom element code in `graphics-element.js` and the actual graphics API found in the master `graphics-api.js` file, with the API components found in its `api` directory.

The `tools/dst` directory contains `dts.js`, which is the script for turning the public api into `graphics-element.d.ts`.

The `tools/fallback` directory contains `generate-placeholders.js`, which is the script for generating fallback images, given a file containing one or more &lt;graphics-element&gt; blocks.

The "playground editor" lives in `edit` and is currently based on the [Monaco ("VS Code") code editor](https://microsoft.github.io/monaco-editor).

### How does the graphics-element work

In short:

1. the graphics-element takes a program written in "graphics element JS" and turns that into a plain JS "ES module" file that will build a canvas element and will run graphics instructions on that.
1. This ES module is then encoded as a data-url, which then gets dynamically imported by the graphics-element, with its exports captured.
1. The exports include a method for starting the program, as well as a reference to the canvas element that will be used, so that the graphics-element can add that canvas element to its shadow DOM, making it show up on the page.

User interaction with the graphics-element is based on normal DOM interaction with the canvas, or any elements that were added by the graphics element itself (such as sliders, buttons, and generated guide text).
