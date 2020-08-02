import { BaseAPI } from "./base-api.js";
import { enrich } from "../lib/enrich.js";
import { Point } from "../lib/types/point.js";
import { Bezier } from "../lib/types/bezier.js";

/**
 * Our Graphics API, which is the "public" side of the API.
 */
class GraphicsAPI extends BaseAPI {
  get PI() {
    return 3.14159265358979;
  }
  get TAU() {
    return 6.28318530717958;
  }
  get POINTER() {
    return `default`;
  }
  get HAND() {
    return `pointer`;
  }

  /**
   * custom element scoped querySelector
   */
  find(qs) {
    return enrich(this.element.querySelector(qs));
  }

  /**
   * custom element scoped querySelectorAll
   */
  findAll(qs) {
    return Array.from(this.element.querySelectorAll(qs)).map((e) => enrich(e));
  }

  /**
   * Set a (CSS) border on the canvas
   */
  setBorder(width = 1, color = `black`) {
    if (width === false) {
      this.canvas.style.border = `none`;
    } else {
      this.canvas.style.border = `${width}px solid ${color}`;
    }
  }

  /**
   * Set the cursor type while the cursor is over the canvas
   */
  setCursor(type) {
    this.canvas.style.cursor = type;
  }

  /**
   * Set the context fillStyle
   */
  setFill(color) {
    this.ctx.fillStyle = color;
  }

  /**
   * Set the context strokeStyle
   */
  setStroke(color) {
    this.ctx.strokeStyle = color;
  }

  /**
   * Set the context lineWidth
   */
  setWidth(width) {
    this.ctx.lineWidth = `${width}px`;
  }

  /**
   * Reset the canvas bitmap to a uniform color.
   */
  clear(color = `transparent`) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw a Point (or {x,y,z?} conformant) object on the canvas
   */
  point(point) {
    point.draw(this.ctx);
  }

  /**
   * Draw a line between two Points
   */
  line(p1, p2) {
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  /**
   * Draw a circle around a Point
   */
  circle(p, r) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, r, 0, this.TAU);
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * Draw text on the canvas
   */
  text(str, x, y) {
    this.ctx.fillText(str, x, y);
  }
}

export { GraphicsAPI, Bezier, Point };
