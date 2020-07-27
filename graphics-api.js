import { enrich } from "./enrich.js";
import { Point } from "./point.js";
import { Bezier } from "./bezier.js";

function enhanceCtx(ctx) {
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
    ];
  }

  static get constants() {
    return [
      `mouse`,
      `POINTER`,
      `HAND`,
    ];
  }

  static get methods() {
    const priv = this.privateMethods;
    const names = Object.getOwnPropertyNames(this.prototype);
    return names.filter(v => priv.indexOf(v) < 0);
  }

  constructor(uid) {
    this.element = window[uid];
    delete window[uid];
    const canvas = (this.canvas = document.createElement(`canvas`));
    canvas.style.border = `1px solid black`;
    this.addListeners();
    this.setup();
    this.draw();
  }

  get PI() { return 3.14159265358979; }

  get TAU() { return 6.28318530717958 }

  addListeners() {
    const canvas = this.canvas;
    this.element.setCanvas(this.canvas);
    this.mouse = {};

    [`touchstart`, `mousedown`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseDown(evt))
    );

    [`touchmove`, `mousemove`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseMove(evt))
    );

    [`touchend`, `mouseup`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseUp(evt))
    );
  }

  find(qs) {
    return enrich(this.element.querySelector(qs));
  }

  findAll(qs) {
    return Array.from(this.element.querySelectorAll(qs)).map(e => enrich(e));
  }

  getMouseCoords(evt) {
    this.mouse.x = evt.offsetX;
    this.mouse.y = evt.offsetY;
  }

  onMouseDown(evt) {
    this.mouse.down = true;
    this.getMouseCoords(evt);
  }

  onMouseMove(evt) {
    this.mouse.move = true;
    this.getMouseCoords(evt);
  }

  onMouseUp(evt) {
    this.mouse.down = false;
    this.mouse.move = false;
    this.getMouseCoords(evt);
  }

  setup() {
    this.ctx = enhanceCtx(this.canvas.getContext(`2d`));
  }

  draw() {
    // console.log(`draw`);
  }

  redraw() {
    this.draw();
  }

  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.style.width = `${w}px`;
    this.canvas.height = h;
    this.ctx = enhanceCtx(this.canvas.getContext(`2d`));
  }

  get POINTER() { return `default`; }
  get HAND() { return `pointer`; }

  setCursor(type) {
    this.canvas.style.cursor = type;
  }

  setFill(color) {
    this.ctx.fillStyle = color;
  }

  setStroke(color) {
    this.ctx.strokeStyle = color;
  }

  setCurve(c) {
    this.curve = c;
    this.curve.setContext(this.ctx);
  }

  clear(color = `transparent`) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  point(point) {
    point.draw(this.ctx);
  }

  line(p1, p2) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  circle(p,r) {
    this.ctx.beginPath();
    this.ctx.arc(p.x,p.y,r,0,this.TAU);
    this.ctx.fill();
    this.ctx.stroke();
  }

  text(str,x,y) {
    this.ctx.fillText(str, x, y);
  }
}

export { GraphicsAPI, Bezier, Point };
