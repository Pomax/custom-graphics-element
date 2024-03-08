/**
 *
 */
declare function setup(): void;
/**
 *
 */
declare function draw(): void;
/**
 * Ensure that there is no border around the canvas element
 */
declare function noBorder(): void;
/**
 * Disable both stroke and fill color.
 */
declare function noColor(): void;
/**
 * Hide the cursor.
 */
declare function noCursor(): void;
/**
 * Disable the fill color.
 */
declare function noFill(): void;
/**
 * Disable the default grid background.
 */
declare function noGrid(): void;
/**
 * Set the line stroke to "solid".
 */
declare function noLineDash(): void;
/**
 * Disable the box shadow.
 */
declare function noShadow(): void;
/**
 * Disable the stroke color.
 */
declare function noStroke(): void;
/**
 * Disable text stroking.
 */
declare function noTextStroke(): void;
/**
 *
 * @param {*} propLabel
 * @param {*} assign
 * @param {*} options
 * @returns
 */
declare function addSlider(propLabel: any, assign: any, options?: any): any;
/**
 *
 */
declare function clearSliders(): void;
/**
 *
 * @param {*} label
 * @param {*} onClick
 * @returns
 */
declare function addButton(label: any, onClick: any): HTMLButtonElement;
/**
 *
 */
declare function clearButtons(): void;
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} r
 * @param {*} s
 * @param {*} e
 * @param {*} wedge
 */
declare function arc(
  x: any,
  y: any,
  r: any,
  s?: any,
  e?: any,
  wedge?: any,
): void;
/**
 *
 * @param {*} hLabel
 * @param {*} hs
 * @param {*} he
 * @param {*} vLabel
 * @param {*} vs
 * @param {*} ve
 * @param {*} hsLabel
 * @param {*} heLabel
 * @param {*} vsLabel
 * @param {*} veLabel
 */
declare function axes(
  hLabel: any,
  hs: any,
  he: any,
  vLabel: any,
  vs: any,
  ve: any,
  hsLabel?: any,
  heLabel?: any,
  vsLabel?: any,
  veLabel?: any,
): void;
/**
 *
 * @param {*} points
 */
declare function bezier(points: any): void;
/**
 *
 * @param {*} points
 * @param {*} open
 */
declare function bspline(points: any, open?: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} r
 */
declare function circle(x: any, y: any, r: any): void;
/**
 *
 * @param {*} color
 */
declare function clear(color?: any): void;
/**
 *
 * @param {*} close
 */
declare function end(close?: any): void;
/**
 *
 */
declare function grid(): void;
/**
 *
 * @param {*} img
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
declare function image(img: any, x: any, y: any, w: any, h: any): Promise<void>;
/**
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 */
declare function line(x1: any, y1: any, x2: any, y2: any): void;
/**
 *
 * @param {*} f
 * @param {*} a
 * @param {*} b
 * @param {*} steps
 * @param {*} xscale
 * @param {*} yscale
 */
declare function plot(
  f: any,
  a?: any,
  b?: any,
  steps?: any,
  xscale?: any,
  yscale?: any,
): void;
/**
 *
 * @param {*} data
 * @param {*} x
 * @param {*} y
 */
declare function plotData(data: any, x: any, y: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 */
declare function point(x: any, y: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
declare function rect(x: any, y: any, w: any, h: any): void;
/**
 * draw a cardinal spline with virtual start and end point
 *
 * @param {*} points
 * @param {*} virtual
 * @param {*} tightness
 * @param {*} T
 */
declare function spline(
  points: any,
  virtual?: any,
  tightness?: any,
  T?: any,
): void;
/**
 *
 */
declare function start(): void;
/**
 *
 * @param {*} str
 * @param {*} x
 * @param {*} y
 * @param {*} xalign
 * @param {*} yalign
 */
declare function text(
  str: any,
  x: any,
  y: any,
  xalign: any,
  yalign?: any,
): void;
/**
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @param {*} x3
 * @param {*} y3
 */
declare function triangle(
  x1: any,
  y1: any,
  x2: any,
  y2: any,
  x3: any,
  y3: any,
): void;
/**
 *
 * @param {*} x
 * @param {*} y
 */
declare function vertex(x: any, y: any): void;
/**
 *
 */
declare function clearMovable(): void;
/**
 *
 * @returns
 */
declare function copy(): HTMLCanvasElement;
/**
 *
 * @param {*} h
 * @param {*} s
 * @param {*} l
 * @param {*} a
 * @returns
 */
declare function color(h?: any, s?: any, l?: any, a?: any): string;
/**
 *
 * @param {*} color
 */
declare function highlight(color: any): void;
/**
 *
 * @returns
 */
declare function millis(): number;
/**
 *
 */
declare function pause(): void;
/**
 *
 */
declare function play(): void;
/**
 *
 * @param {*} a
 * @param {*} cycle
 * @returns
 */
declare function randomColor(a?: any, cycle?: any): string;
/**
 *
 * @param {*} points
 */
declare function setMovable(points: any): void;
/**
 *
 */
declare function restore(): void;
/**
 * Save the canvas context.
 */
declare function save(): void;
/**
 *
 * @returns
 */
declare function toDataURL(): any;
/**
 *
 * @returns
 */
declare function togglePlay(): any;
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */
declare function project(x: any, y: any, z: any): any;
/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */
declare function rotateProjector(x: any, y: any, z: any): any;
/**
 *
 * @param  {...any} args
 */
declare function setProjector(...args: any[]): void;
/**
 *
 * @param {*} width
 * @param {*} color
 */
declare function setBorder(width?: any, color?: any): void;
/**
 *
 * @param {*} color
 */
declare function setColor(color: any): void;
/**
 *
 * @param {*} enabled
 */
declare function setCrisp(enabled?: any): void;
/**
 *
 * @param {*} type
 */
declare function setCursor(type: any): void;
/**
 *
 * @param {*} color
 */
declare function setFill(color?: any): void;
/**
 *
 * @param {*} font
 */
declare function setFont(font: any): void;
/**
 *
 * @param {*} name
 */
declare function setFontFamily(name: any): void;
/**
 *
 * @param {*} px
 */
declare function setFontSize(px: any): void;
/**
 *
 * @param {*} val
 */
declare function setFontWeight(val: any): void;
/**
 *
 * @param {*} spacing
 * @param {*} color
 */
declare function setGrid(spacing?: any, color?: any): void;
/**
 *
 * @param {*} color
 */
declare function setHighlightColor(color: any): void;
/**
 *
 * @param  {...any} values
 */
declare function setLineDash(...values: any[]): void;
/**
 *
 * @param {*} width
 */
declare function setLineWidth(width?: any): void;
/**
 *
 * @param {*} color
 */
declare function setStroke(color?: any): void;
/**
 *
 * @param {*} xAlign
 * @param {*} yAlign
 */
declare function setTextAlign(xAlign: any, yAlign?: any): void;
/**
 *
 * @param {*} dir
 */
declare function setTextDirection(dir?: any): void;
/**
 *
 * @param {*} color
 * @param {*} width
 */
declare function setTextStroke(color: any, width: any): void;
/**
 *
 */
declare function resetTransform(): void;
/**
 *
 * @param {*} angle
 */
declare function rotate(angle?: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 */
declare function scale(x?: any, y?: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
declare function screenToWorld(
  x: any,
  y: any,
): {
  x: any;
  y: any;
};
/**
 * transforms: universal free transform based on applying
 *
 *       | a b c |
 *   m = | d e f |
 *       | 0 0 1 |
 */
declare function transform(
  a?: number,
  b?: number,
  c?: number,
  d?: number,
  e?: number,
  f?: number,
): void;
/**
 *
 * @param {*} x
 * @param {*} y
 */
declare function translate(x?: any, y?: any): void;
/**
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
declare function worldToScreen(
  x: any,
  y: any,
): {
  x: any;
  y: any;
};
