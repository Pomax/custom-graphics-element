import { CustomElement } from "./custom-element.js";

import { Bezier } from "./api/types/bezier.js";
import { BSpline } from "./api/types/bspline.js";
import { Point, Circle } from "./api/types/point.js";
import { Vector } from "./api/types/vector.js";
import { Matrix } from "./api/types/matrix.js";
import { Shape } from "./api/util/shape.js";

export { Bezier, BSpline, Point, Circle, Vector, Matrix, Shape };

const thisURL = import.meta.url;
const libraryCode = await (await fetch(`./test-lib.js`)).text();

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
      :host([hidden]) { display: none; }
      :host { max-width: calc(2em + ${this.getAttribute(`width`)}px); }
      :host style { display: none; }
      :host .top-title { display: flex; flex-direction: row-reverse; justify-content: space-between; }
      :host canvas { touch-action: none; user-select: none; position: relative; z-index: 1; display: block; margin: auto; border-radius: 0; box-sizing: content-box!important; border: 1px solid lightgrey; }
      :host canvas:focus { border: 1px solid red; }
      :host a.view-source { font-size: 60%; text-decoration: none; }
      :host button.reset { font-size: 0.5em; }
      :host label { display: block; font-style:italic; font-size: 0.9em; text-align: right; }
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
    userCode = `let ` + varNames.join(`, `) + `;\n` + userCode;

    const module = btoa(
      [
        `import { Bezier, BSpline, Point, Circle, Vector, Matrix, Shape } from "${thisURL}";`,
        userCode,
        `const __randomId = "${Date.now()}";`, // ensures reloads work
        libraryCode,
        `export { reset as start, __canvas as canvas, halt }`,
      ].join(`\n`)
    );

    import(`data:text/javascript;base64,${module}`).then((lib) => {
      const { start, canvas, halt } = lib;
      this.canvas = canvas;
      this.halt = () => halt();
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
  }
}

// Register our custom element
await CustomElement.register(GraphicsElement);
