import { enrich } from "./lib/enrich.js";
import { Point } from "./lib/point.js";
import { Bezier } from "./lib/bezier.js";

// Outright kill off an event.
function stop(evt) {
  evt.preventDefault();
  evt.stopPropagation();
}

// Ensure there are cacheStyle/restoreStyle functions
// on the Canvas context, so that it's trivial to make
// temporary changes.
function enhanceContext(ctx) {
  const styles = [];
  ctx.cacheStyle = () => {
    styles.push({
      strokeStyle: ctx.strokeStyle,
      fillStyle: ctx.fillStyle,
      lineWidth: ctx.lineWidth
    });
  };
  ctx.restoreStyle = () => {
    const v = styles.pop();
    Object.keys(v).forEach(k => ctx[k] = v[k]);
  };
  return ctx;
}

/**
 * Our Graphics API
 */
class GraphicsAPI {
  static get privateMethods() {
    return [
      `constructor`,
      `addListeners`,
      `getMouseCoords`,
    ]
    .concat(this.superCallers)
    .concat(this.eventHandlers);
  }

  static get superCallers() {
    return [
      `setup`,
      `draw`,
    ];
  }

  static get eventHandlers() {
    return [
      `onMouseDown`,
      `onMouseMove`,
      `onMouseUp`,
      `onKeyDown`,
      `onKeyUp`,
    ];
  }

  static get constants() {
    return [
      `POINTER`,
      `HAND`,
      `PI`,
      `TAU`,
    ];
  }

  static get methods() {
    const priv = this.privateMethods;
    const names = Object.getOwnPropertyNames(this.prototype);
    return names.filter(v => priv.indexOf(v) < 0);
  }

  /**
   *
   */
  constructor(uid, width=200, height=200) {
    this.element = window[uid];
    delete window[uid];
    this.canvas = document.createElement(`canvas`);
    this.addListeners();
    this.setSize(width, height);
    this.setup();
    this.draw();
  }

  /**
   *
   */
  addListeners() {
    const canvas = this.canvas;
    const element = this.element;
    element.setGraphic(this);

    this.cursor = {};

    [`touchstart`, `mousedown`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseDown(evt))
    );

    [`touchmove`, `mousemove`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseMove(evt))
    );

    [`touchend`, `mouseup`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseUp(evt))
    );

    this.keyboard = {};

    [`keydown`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onKeyDown(evt))
    );

    [`keyup`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onKeyUp(evt))
    );
  }

  /**
   *
   */
  getMouseCoords(evt) {
    this.cursor.x = evt.offsetX;
    this.cursor.y = evt.offsetY;
  }

  /**
   *
   */
  onMouseDown(evt) {
    stop(evt);
    this.cursor.button = evt.button;
    this.cursor.down = true;
    this.getMouseCoords(evt);
  }

  /**
   *
   */
  onMouseMove(evt) {
    stop(evt);
    this.cursor.button = undefined;;
    this.cursor.move = true;
    this.getMouseCoords(evt);
  }

  /**
   *
   */
  onMouseUp(evt) {
    stop(evt);
    this.cursor.button = evt.button;
    this.cursor.down = false;
    this.cursor.move = false;
    this.getMouseCoords(evt);
  }

  /**
   *
   */
  safelyInterceptKey(evt) {
    // We don't want to interfere with the browser, so we're only
    // going to allow unmodified keys, or shift-modified keys.
    if (!evt.altKey && !evt.ctrlKey && !evt.metaKey) {
      stop(evt);
    }
  }

  /**
   *
   */
  onKeyDown(evt) {
    this.safelyInterceptKey(evt);
    // FIXME: Known bug: this approach means that "shift + r + !shift + !r" leaves "R" set to true
    this.keyboard[evt.key] = true;
    this.keyboard.currentKey = evt.key;
  }

  /**
   *
   */
  onKeyUp(evt) {
    this.safelyInterceptKey(evt);
    // FIXME: Known bug: this approach means that "shift + r + !shift + !r" leaves "R" set to true
    this.keyboard[evt.key] = false;
    this.keyboard.currentKey = evt.key;
  }

  // ====================================
  //
  //      START OF THE GRAPHICS API
  //
  // ====================================


  /**
   * Constants
   */

  get PI() { return 3.14159265358979; }
  get TAU() { return 6.28318530717958; }
  get POINTER() { return `default`; }
  get HAND() { return `pointer`; }

  /**
   * ...
   */
  setup() {
    // console.log(`setup`);
  }

  /**
   * ...
   */
  draw() {
    // console.log(`draw`);
  }

  /**
   * ...
   */
  redraw() {
    this.draw();
  }

  /**
   * ...
   */
  find(qs) {
    let e = this.element.querySelector(qs);
    return e ? enrich(e) : e;
  }

  /**
   * ...
   */
  findAll(qs) {
    return Array.from(this.element.querySelectorAll(qs)).map(e => enrich(e));
  }

  /**
   * ...
   */
  setSize(w, h) {
    this.width = w || this.width;
    this.height = h || this.height;
    this.canvas.width = this.width;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.height = this.height;
    this.ctx = enhanceContext(this.canvas.getContext(`2d`));
  }

  /**
   * ...
   */
  setBorder(width=1, color=`black`) {
    this.canvas.style.border = `${width}px solid ${color}`;
  }

  /**
   * ...
   */
  forceFocus() {
    this.canvas.focus();
  }

  /**
   * ...
   */
  showFocus(show=true) {
    const canvas = this.canvas;
    if (show) {
      canvas.setAttribute(`tabIndex`, 0);
      canvas.classList.add(`focus-enabled`);
      canvas._force_listener = () => this.forceFocus();
      [`touchstart`, `mousedown`].forEach((evtName) =>
        canvas.addEventListener(evtName, canvas._force_listener)
      );
    } else {
      canvas.removeAttribute(`tabIndex`);
      canvas.classList.remove(`focus-enabled`);
      [`touchstart`, `mousedown`].forEach((evtName) =>
        canvas.removeEventListener(evtName, canvas._force_listener)
      );
    }
  }

  /**
   * ...
   */
  setCursor(type) {
    this.canvas.style.cursor = type;
  }

  /**
   * ...
   */
  setFill(color) {
    this.ctx.fillStyle = color;
  }

  /**
   * ...
   */
  setStroke(color) {
    this.ctx.strokeStyle = color;
  }

  /**
   * ...
   */
  setWidth(width) {
    this.ctx.lineWidth = `${width}px`;
  }

  /**
   * ...
   */
  clear(color = `transparent`) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * ...
   */
  point(point) {
    point.draw(this.ctx);
  }

  /**
   * ...
   */
  line(p1, p2) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  /**
   * ...
   */
  circle(p,r) {
    this.ctx.beginPath();
    this.ctx.arc(p.x,p.y,r,0,this.TAU);
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * ...
   */
  text(str,x,y) {
    this.ctx.fillText(str, x, y);
  }
}

export { GraphicsAPI, Bezier, Point };
