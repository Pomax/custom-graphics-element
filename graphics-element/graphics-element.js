import { CustomElement } from "./custom-element.js";
import { CSS_COLOR_NAMES, CSS_COLOR_MAP } from "./api/util/colors.js";
import { BSpline } from "./api/types/bspline.js";
import { Point, Circle } from "./api/types/point.js";
import { Vector } from "./api/types/vector.js";
import { Matrix } from "./api/types/matrix.js";
export { BSpline, Point, Circle, Vector, Matrix, CSS_COLOR_MAP };

import {
  base64,
  decode64,
  getURLbase,
  isInViewport,
} from "./api/util/utils.js";
const thisURL = String(import.meta.url);
const libraryCode = decode64(`GRAPHICS_API_PLACEHOLDER`);

class GraphicsElement extends CustomElement {
  handleAttributeChange(...args) {
    // console.log(...args);
  }

  handleChildChanges(...args) {
    // console.log(...args);
  }

  connectedCallback() {
    super.connectedCallback();

    this.label = document.createElement(`label`);
    if (!this.title) {
      console.warn(
        `<graphics-element> is missing a title attribute. Always caption your figures.`
      );
      this.title = ``;
    }
    this.label.textContent = this.title;

    if (isInViewport(this)) {
      this.loadSource();
    } else {
      // if we don't, wait until we're in view
      new IntersectionObserver(
        (entries, observer) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadSource();
              observer.disconnect();
            }
          }),
        { threshold: 0.1, rootMargin: `${window.innerHeight}px` }
      ).observe(this);
    }
  }

  getStyle() {
    return `
:host([hidden]) { display: none; }
style { display: none; }
.top-title { display: flex; flex-direction: row; justify-content: space-between; }
canvas { touch-action: none; user-select: none; position: relative; z-index: 1; display: block; margin: auto; border-radius: 0; box-sizing: content-box !important; border: 1px solid lightgrey;
&.crisp { image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges; }
&:focus { border: 1px solid red; }}
a { &.view-source { font-size: 60%; text-decoration: none;
&.plus { padding-left: 0.5em; }}}
button.reset { font-size: 0.5em; top: -0.35em; position: relative; }
label:not(:empty) { display: block; font-style: italic; font-size: 0.9em; text-align: right; padding-right: 1em; margin-top: 0.35em; }
`;
  }

  async loadSource(
    userCode,
    width = this.width,
    height = this.height,
    additionalSources
  ) {
    if (!width && !height) {
      width = parseFloat(this.getAttribute(`width`));
      height = parseFloat(this.getAttribute(`height`));
      if (isNaN(width)) width = undefined;
      if (isNaN(height)) height = undefined;
    }

    // Get the main user code
    if (!userCode) {
      // previously cached?
      if (this.userCode) {
        userCode = this.userCode;
      }
      // no: let's find out source
      else {
        // source attribute?
        const src = this.getAttribute(`src`);
        if (src) {
          userCode = await (await fetch(src)).text();
        }
        // nope. <graphics-source> element?
        else {
          const gse = this.querySelector(`graphics-source`);
          if (gse) {
            userCode = gse.textContent;
          }
          // nope. Guess we're just loading  a stub.
          else {
            userCode = `function setup() {\n}\nfunction draw() {\n}\n`;
          }
        }
      }
    }
    this.userCode = userCode;

    // If there are `<source>` elements, load those in too
    if (!additionalSources) {
      if (this.additionalSources) {
        additionalSources = this.additionalSources;
      } else {
        const sourceElements = this.querySelectorAll(`source`);
        additionalSources = await Promise.all(
          Array.from(sourceElements).map((e) =>
            fetch(e.src).then((r) => r.text())
          )
        );
      }
    }
    this.additionalSources = additionalSources;

    // Bundle our source code
    let sourceCode = this.userCode;
    if (this.additionalSources.length > 0) {
      sourceCode = this.loadAdditionalSources(
        this.userCode,
        this.additionalSources
      );
    }

    // slider magic
    const matches = sourceCode.matchAll(/addSlider\(['"`](.*)['"`]/g);
    const varNames = [];
    for (let m of matches) {
      varNames.push(m[1]);
      sourceCode = sourceCode.replace(m[0], m[0] + `, (v) => (${m[1]} = v)`);
    }

    if (varNames.length) {
      sourceCode = `let ` + varNames.join(`, `) + `;\n` + sourceCode;
    }

    // fix imports
    sourceCode = sourceCode.replaceAll(
      / from ['"].([^'"]+)['"]/g,
      ` from "${getURLbase(location.href)}/$1"`
    );

    // ensure there's always a setSize
    if (!sourceCode.includes(`function setup()`)) {
      sourceCode = `function setup() {\n}\n` + sourceCode;
    }

    if (!sourceCode.includes(`setSize(`)) {
      let replacement = `setSize();`;
      if (width && height) {
        replacement = `setSize(${width}, ${height});`;
      }
      sourceCode = sourceCode.replace(
        `function setup() {`,
        `function setup() {\n  ${replacement}`
      );
    }

    const module = base64(
      [
        `"use strict";`,
        `import { BSpline, Point, Circle, Vector, Matrix, CSS_COLOR_MAP } from "${thisURL}";`,
        `const __randomId = "${Date.now()}";`, // ensures reloads work
        libraryCode,
        sourceCode,
        `export { reset as start, __canvas as canvas, halt, highlight, __getDescription as getDescription }`,
      ].join(`\n`)
    );

    import(`data:text/javascript;base64,${module}`).then(async (lib) => {
      const { start, canvas, halt, highlight, getDescription } = lib;
      this.canvas = canvas;
      this.halt = () => halt();
      this.highlight = (color) => highlight(color);
      this.render();
      const { width, height } = await start(this);

      const descClass = `graphics-element-description`;
      this.querySelector(`.${descClass}`)?.remove();
      if (!this.querySelector(`p`)) {
        this.handleGraphicsDescription(descClass, getDescription);
      }

      if (width && height) {
        this.style.width = ``;
        this.style.height = ``;
        this.width = width;
        this.height = height;
        this.setAttribute(`width`, width);
        this.setAttribute(`height`, height);
      }
      // Once we've rendered, and the sketch is running, we can send the "we're loaded" event
      this.dispatchEvent(new CustomEvent(`load`));
      if (this.onload) this.onload();
    });
  }

  handleGraphicsDescription(descClass, getDescription = () => {}) {
    try {
      const description = getDescription();
      if (description) {
        const doc = new DocumentFragment();
        const div = document.createElement(`div`);
        div.classList.add(descClass);
        doc.append(div);
        div.innerHTML = description;
        this.append(div);
      }
    } catch (e) {
      console.error(e);
    }
  }

  loadAdditionalSources(userCode, additionalSources) {
    if (!additionalSources) return userCode;
    const empty = new Array(additionalSources.length);
    return (
      userCode +
      `\n` +
      additionalSources
        .map((text, pos) =>
          text
            .replace(`function setup()`, `function setup${pos + 1}()`)
            .replace(`function draw()`, `function draw${pos + 1}()`)
        )
        .join(`\n`) +
      `\n` +
      `function __more_setup() { ${[...empty]
        .map(
          (_, pos) =>
            `if (typeof setup${pos + 1} !== \`undefined\`) setup${pos + 1}();`
        )
        .join(`\n`)} }` +
      `\n` +
      `function __more_draw() { ${[...empty]
        .map(
          (_, pos) =>
            `if (typeof draw${pos + 1} !== \`undefined\`) draw${pos + 1}();`
        )
        .join(`\n`)} }` +
      `\n`
    );
  }

  loadFromFunction(sourceCodeFunction) {
    let code = sourceCodeFunction.toString();
    this.reset(code.substring(code.indexOf(`{`) + 1, code.lastIndexOf(`}`)));
  }

  reset(newCode, additionalSources) {
    if (this.halt) this.halt();
    this.crosslinked = false;
    this.querySelector(`button.remove-color`)?.remove();
    this.loadSource(
      newCode || this.userCode,
      this.width,
      this.height,
      additionalSources || this.additionalSources
    );
  }

  render() {
    super.render();

    const slotParent = this._slot.parentNode;
    if (this.canvas) slotParent.insertBefore(this.canvas, this._slot);
    if (this.label) slotParent.insertBefore(this.label, this._slot);

    const topTitle = document.createElement(`div`);
    topTitle.classList.add(`top-title`);
    const sources = document.createElement(`span`);
    sources.classList.add(`sources`);
    topTitle.append(sources);

    const r = document.createElement(`button`);
    r.classList.add(`reset`);
    r.textContent = this.getAttribute(`reset`) || `reset`;
    r.addEventListener(`click`, () => this.reset());
    topTitle.append(r);

    let src = this.getAttribute(`src`);
    if (!src) {
      src = `data:application/json;base64,${base64(this.userCode)}`;
    }
    if (src) {
      const a = document.createElement(`a`);
      a.classList.add(`view-source`);
      a.textContent = this.getAttribute(`viewSource`) || `view source`;
      a.href = src;
      a.target = `_blank`;
      sources.append(a);
    }

    let additionalSources = this.querySelectorAll(`source`);
    if (additionalSources.length === 0) {
      additionalSources = (this.additionalSources ?? []).map((sourceCode) => ({
        src: `data:application/json;base64,${base64(sourceCode)}`
      }));
    }
    if (additionalSources.length) {
      additionalSources.forEach((e, pos) => {
        const { src } = e;
        const a = document.createElement(`a`);
        a.classList.add(`view-source`, `plus`);
        a.textContent = `[+${pos + 1}]`;
        a.href = src;
        a.target = `_blank`;
        sources.append(a);
      });
    }

    if (this.label) slotParent.insertBefore(topTitle, this.canvas);

    this.crossLink();
  }

  crossLink() {
    if (this.crossLinked) return;
    this.crossLinked = true;

    let addRemoveButton = false;
    this.querySelectorAll(`p`).forEach((p) => {
      p.querySelectorAll(`*`).forEach((e) => {
        if (!CSS_COLOR_NAMES.includes(e.tagName)) return;
        addRemoveButton = true;
        let color;
        e.classList.remove(`calm`);
        e.addEventListener(`pointerenter`, () => {
          color ??= getComputedStyle(e)[`-webkit-text-stroke-color`];
          this.highlight(color);
        });
        e.addEventListener(`pointerleave`, () => this.highlight(false));
      });
    });

    if (addRemoveButton) {
      const disableColors = document.createElement(`button`);
      disableColors.textContent = `remove colors`;
      disableColors.classList.add(`remove-color`);
      disableColors.addEventListener(`click`, () => {
        this.querySelectorAll(`p`).forEach((p) => {
          p.querySelectorAll(`*`).forEach((e) => {
            if (CSS_COLOR_NAMES.includes(e.tagName)) {
              e.classList.add(`calm`);
            }
          });
        });
        disableColors.remove();
      });
      this.append(disableColors);
    }
  }
}

// The only reason this is a custom element is because it should never be visible.
class GraphicsSource extends CustomElement {
  constructor() {
    super();
    this.style.display = `none`;
  }
}

// Register our custom elements
await CustomElement.register(GraphicsElement);
await CustomElement.register(GraphicsSource);
