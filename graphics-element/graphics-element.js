import { CustomElement } from "./custom-element.js";
import { CSS_COLOR_NAMES, CSS_COLOR_MAP } from "./api/util/colors.js";
import { BSpline } from "./api/types/bspline.js";
import { Point, Circle } from "./api/types/point.js";
import { Vector } from "./api/types/vector.js";
import { Matrix } from "./api/types/matrix.js";

export { BSpline, Point, Circle, Vector, Matrix, CSS_COLOR_MAP };

const thisURL = String(import.meta.url);
const apiURL = thisURL.replace(`element.js`, `api.js`);
const response = await fetch(apiURL);
const libraryCode = await response.text();

function getURLbase(path) {
  const regex = /^(.*)\/([^.]+(\.([^\/?#]+))+)(\?[^#]*)?(#.*)?$/;
  const match = path.match(regex);
  if (match !== null) {
    const { [1]: dirname, [2]: file, [4]: ext } = match;
    console.log(`URL is for a file "${file}", with extension "${ext}"`);
    path = dirname;
  }
  return path;
}

function isInViewport(e) {
  if (typeof window === `undefined`) return true;
  if (typeof document === `undefined`) return true;

  var b = e.getBoundingClientRect();
  return (
    b.top >= 0 &&
    b.left >= 0 &&
    b.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    b.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

class GraphicsElement extends CustomElement {
  constructor() {
    super();
    this.label = document.createElement(`label`);
    if (!this.title) this.title = ``;
    this.label.textContent = this.title;
  }

  handleAttributeChange(...args) {
    // console.log(...args);
  }

  handleChildChanges(...args) {
    // console.log(...args);
  }

  connectedCallback() {
    super.connectedCallback();
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
      :host([hidden]) {
        display: none;
      }
      :host style {
        display: none;
      }
      :host .top-title {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
      }
      :host canvas {
        touch-action: none;
        user-select: none;
        position: relative;
        z-index: 1;
        display: block;
        margin: auto;
        border-radius: 0;
        box-sizing: content-box!important;
        border: 1px solid lightgrey;
      }
      :host canvas.crisp {
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      :host canvas:focus {
        border: 1px solid red;
      }
      :host a.view-source {
        font-size: 60%;
        text-decoration: none;
      }
      :host button.reset {
        font-size: 0.5em;
        top: -0.35em;
        position: relative;
      }
      :host label:not(:empty) {
        display: block;
        font-style:italic;
        font-size: 0.9em;
        text-align: right;
        padding-right: 1em;
        margin-top: 0.35em;
      }
    `;
  }

  async loadSource(width, height) {
    // prevent DOM reflow on resets
    if (width && height) {
      this.style.width = width;
      this.style.height = height;
    }

    const src = this.getAttribute(`src`);
    let userCode = await (await fetch(src)).text();

    // slider magic
    const matches = userCode.matchAll(/addSlider\(['"`](.*)['"`],\s*/g);
    const varNames = [];
    for (let m of matches) {
      varNames.push(m[1]);
      userCode = userCode.replace(m[0], m[0] + `(v) => (${m[1]} = v), `);
    }

    if (varNames.length) {
      userCode = `let ` + varNames.join(`, `) + `;\n` + userCode;
    }

    // fix imports
    userCode = userCode.replaceAll(
      / from ['"].([^'"]+)['"]/g,
      ` from "${getURLbase(location.href)}/$1"`
    );

    // inject size
    const w = this.getAttribute(`width`);
    const h = this.getAttribute(`height`);
    if (w && h) {
      userCode = userCode.replace(
        `function setup() {`,
        `function setup() {\n  setSize(${w}, ${h});`
      );
    }

    const module = base64(
      [
        `import { BSpline, Point, Circle, Vector, Matrix, CSS_COLOR_MAP } from "${thisURL}";`,
        `const __randomId = "${Date.now()}";`, // ensures reloads work
        libraryCode,
        userCode,
        `export { reset as start, __canvas as canvas, halt, highlight }`,
      ].join(`\n`)
    );

    import(`data:text/javascript;base64,${module}`).then((lib) => {
      const { start, canvas, halt, highlight } = lib;
      this.canvas = canvas;
      this.halt = () => halt();
      this.highlight = (color) => highlight(color);
      this.render();
      if (width && height) {
        this.style.width = ``;
        this.style.height = ``;
      }
      start(this);
      // Once we've rendered, and the sketch is running, we can send the "we're loaded" event
      this.dispatchEvent(new CustomEvent(`load`));
      if (this.onload) this.onload();
    });
  }

  render() {
    super.render();

    const slotParent = this._slot.parentNode;
    if (this.canvas) slotParent.insertBefore(this.canvas, this._slot);
    if (this.label) slotParent.insertBefore(this.label, this._slot);

    const toptitle = document.createElement(`div`);
    toptitle.classList.add(`top-title`);

    const r = document.createElement(`button`);
    r.classList.add(`reset`);
    r.textContent = this.getAttribute(`reset`) || `reset`;
    r.addEventListener(`click`, () => {
      const { width, height } = this.halt();
      this.crosslinked = false;
      this.querySelector(`button.remove-color`)?.remove();
      this.loadSource(width, height);
    });
    toptitle.append(r);

    const src = this.getAttribute(`src`);
    if (src) {
      const a = document.createElement(`a`);
      a.classList.add(`view-source`);
      a.textContent = this.getAttribute(`viewSource`) || `view source`;
      a.href = src;
      a.target = `_blank`;
      toptitle.append(a);
    }

    if (this.label) slotParent.insertBefore(toptitle, this.canvas);

    this.crosslink();
  }

  crosslink() {
    if (this.crosslinked) return;
    this.crosslinked = true;

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

function base64(data) {
  const bytes = new TextEncoder().encode(data);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

// Register our custom element
await CustomElement.register(GraphicsElement);
