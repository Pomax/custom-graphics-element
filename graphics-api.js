import { enrich } from "./enrich.js";
import { INSTANCE_KEY } from "./keys.js";

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

  static get publicProperties() {
    return [
      `mouseMove`,
      `mouseDown`,
      `mouseX`,
      `mouseY`,
      `curve`,
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
    this.element = window[INSTANCE_KEY][uid];
    const canvas = (this.canvas = document.createElement(`canvas`));
    canvas.style.border = `1px solid black`;
    this.setup();
    this.addListeners();
    this.draw();
  }

  get PI() { return 3.14159265358979; }

  get TAU() { return 6.28318530717958 }

  addListeners() {
    const canvas = this.canvas;
    this.element.setCanvas(this.canvas);

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
    this.mouseX = evt.offsetX;
    this.mouseY = evt.offsetY;
  }

  onMouseDown(evt) {
    this.mouseDown = true;
    this.getMouseCoords(evt);
  }

  onMouseMove(evt) {
    this.mouseMove = true;
    this.getMouseCoords(evt);
  }

  onMouseUp(evt) {
    this.mouseDown = false;
    this.mouseMove = false;
    this.getMouseCoords(evt);
  }

  setup() {
    this.ctx = this.canvas.getContext(`2d`);
  }

  draw() {
    console.log(`draw`);
  }

  redraw() {
    this.draw();
  }

  setSize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext(`2d`);
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
  }

  clear(color = `transparent`) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSkeleton() {
    this.curve.drawSkeleton(this.ctx);
  }

  drawCurve() {
    this.curve.draw(this.ctx);
  }

  drawPoint(x,y) {
    this.ctx.fillRect(x,y,2,2);
  }

  drawLine(x,y,v,w) {
    this.ctx.beginPath();
    this.ctx.moveTo(x,y);
    this.ctx.lineTo(v,w);
    this.ctx.stroke();
  }

  drawCircle(x,y,r) {
    this.ctx.beginPath();
    this.ctx.arc(x,y,r,0,this.TAU);
    this.ctx.fill();
    this.ctx.stroke();
  }
}

// TODO: I'm not a fan of this, but I don't know how to inject a script
//       so that it'll run outside of "adding it to the <head>" which means
//       the GraphicsAPI object needs to be accessible in global scope...
if (!window.GraphicsAPI) {
  window.GraphicsAPI = GraphicsAPI;
}

export { GraphicsAPI };
