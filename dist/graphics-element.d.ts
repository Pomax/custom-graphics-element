/**
 *
 */
declare function setup(): void;
/**
 *
 */
declare function draw(): void;
/**
 *
 * @param trueOrFalse
 */
declare function pointerActive(trueOrFalse: boolean): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerDown(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerUp(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerClick(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerMove(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerDrag(x: number, y: number): void;
/**
 *
 * @param key
 * @param shift
 * @param alt
 * @param ctrl
 * @param meta
 */
declare function keyDown(
  key: string,
  shift: boolean,
  alt: boolean,
  ctrl: boolean,
  meta: boolean,
): void;
/**
 *
 * @param key
 * @param shift
 * @param alt
 * @param ctrl
 * @param meta
 */
declare function keyUp(
  key: string,
  shift: boolean,
  alt: boolean,
  ctrl: boolean,
  meta: boolean,
): void;
/**
 *
 */
declare type width = number;
/**
 *
 */
declare type height = number;
/**
 *
 */
declare type playing = boolean;
/**
 *
 */
declare type frame = number;
/**
 *
 */
declare type frameDelta = number;
/**
 *
 */
declare type currentPoint = { x: number; y: number };
/**
 *
 */
declare type pointer = {
  active: boolean;
  down: boolean;
  drag: boolean;
  mark:
    | undefined
    | {
        x: number;
        y: number;
      };
  x: number;
  y: number;
};

/**
 *
 */
declare type keyboard = {
  [letter: string]: number;
};
/**
 * Ensure that there is no border around the canvas element.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setBorder(5, `red`);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       text(`click me`, width/2, height/2);
 *     }
 *     function pointerUp(x, y) {
 *       setBorder(5, `red`);
 *       redraw()
 *     }
 *     function pointerDown(x, y) {
 *       noBorder();
 *       redraw()
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noBorder(): void;
/**
 * Disable both stroke and fill color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       text(`Now you see me`, width/2, height/2 - 25);
 *       noColor();
 *       text(`Now you don't`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noColor(): void;
/**
 * Hide the cursor.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`#FF02`);
 *       rect(0, 0, width/2, height);
 *       setColor(`#0FF2`);
 *       rect(width/2, 0, width/2, height);
 *     }
 *     function pointerMove(x, y) {
 *       if (x < width/2) {
 *         setCursor(AUTO);
 *       } else {
 *         noCursor();
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noCursor(): void;
/**
 * Disable the fill color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`filled`, width/2, height/2 - 25);
 *       noFill();
 *       rect(30, 80, 20, 20);
 *       text(`not filled`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noFill(): void;
/**
 * Disable the default grid background.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       text(`click me`, width/2, height/2);
 *     }
 *     function pointerUp(x, y) {
 *       setGrid(20, `lightgrey`);
 *       redraw()
 *     }
 *     function pointerDown(x, y) {
 *       noGrid();
 *       redraw()
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noGrid(): void;
/**
 * Set the line stroke to "solid".
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setLineDash(1);
 *       line(0,20,width,50);
 *       setLineDash(5);
 *       line(0,30,width,90);
 *       setLineDash(1,2,3,4);
 *       line(0,40,width,130);
 *       noLineDash();
 *       line(0,50,width,180);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noLineDash(): void;
/**
 * Disable the stroke color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`red`);
 *       setStroke(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`stroked`, width/2, height/2 - 25);
 *       noStroke();
 *       rect(42, 82, 20, 20);
 *       text(`not stroked`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noStroke(): void;
/**
 * Disable text stroking, but not regular shape stroking.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, CENTER);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`red`);
 *       setStroke(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`stroked`, width/2, height/2 - 25);
 *       noStroke();
 *       rect(42, 82, 20, 20);
 *       text(`not stroked`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function noTextStroke(): void;
/**
 * Add a slider to your figure, allowing users to control
 * a variable in your graphics code directly by interacting
 * with that on-page slider, which is especially important if
 * you want your graphics to be useable by users who don't
 * have, or cannot use, a mouse.
 *
 * The `propLabel` value should be the name of the variable
 * that your graphics code uses, and should _not_ be "preallocated"
 * in your code with a const, let, or var: it will automatically
 * get added as part of the source loading process.
 *
 * The options object accepts the following properties and values:
 *
 * - min:number - the slider's minimum value, defaults to 0
 * - max:number - the slider's maximum value, defaults to 1
 * - step - the step size, defaults to (max - min)/10
 * - value - the initial value, defaults to (max + min)/2
 * - classes - the CSS classes that will be used, defaults to `sider`
 * - transform - a value preprocessor  defaults to (v) => v
 *
 * The `transform` pre-processor runs after the user updates
 * the slider, but before its value gets assigned to your variable,
 * so that you can map it to something else (for instance, numbers
 * in one range to numbers in a completely different range, or even
 * numbers to strings or entire objects)
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(400, 200);
 *       addSlider(`bgColor`, {
 *         min: 0,
 *         max: 255,
 *         step: 1,
 *         value: 200,
 *         transform: (v) => {
 *           // convert v into a hex color code
 *           v = (v).toString(16).padStart(2, `0`);
 *           return `#${v}${v}${v}`;
 *         }
 *       });
 *     }
 *     function draw() {
 *       clear(bgColor);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} propLabel
 * @param {*} options
 * @returns returns the HTML input element for this slider
 */
declare function addSlider(propLabel: string, assign: any, options?: any): any;
/**
 * Remove all sliders for your figure from the page.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       addSlider(`x`);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, CENTER);
 *       text(`click to clear`, width/2, height/2);
 *     }
 *     function pointerDown() {
 *       clearSliders();
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function clearSliders(): void;
/**
 * Add a button below your figure that can trigger event-based
 * code, which is especially important if you want your graphics
 * to be useable by users who don't have, or cannot use, a mouse.
 *
 * onClick is similar to the standard JS event handler, except
 * that the call argument is a reference to your button, not
 * the click event.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const colors = [`white`, `black`];
 *     let bgColor = 0;
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`flip background`, () => {
 *         bgColor = -(bgColor - 1);
 *         redraw();
 *       });
 *     }
 *     function draw() {
 *       clear(colors[bgColor]);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} label
 * @param {*} onClick
 * @returns
 */
declare function addButton(label: any, onClick: any): HTMLButtonElement;
/**
 * Remove all buttons for your figure from the page.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`this does nothing`, () => {});
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, CENTER);
 *       text(`click to clear`, width/2, height/2);
 *     }
 *     function pointerDown() {
 *       clearButtons();
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function clearButtons(): void;
/**
 * Draw a circular arc with radius `r` at (x,y),
 * starting at angle `s` and ending at angle `e`.
 * If `wedge` is true, this will draw a closed
 * shape that is anchored at (x,y). If omitted
 * or explicitly set to false, this will draw
 * an open shape with a fill that connects the
 * first and last point on the arc, but no closing
 * stroke.
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       arc(width/2 + 30, height/2 - 40, 40, 0, 0.66*TAU);
 *       arc(width/2 - 30, height/2 + 20, 40, 0, 0.66*TAU, true);
 *     }
 *   </graphics-source>
 * </graphics-element>
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
 * Draw one or more Bezier curves from an array
 * of Point or Point-likes that implement:
 *
 *   {
 *     x: number
 *     y: number
 *   }
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       bezier(
 *         new Point(20, height - 55),
 *         new Point(20, 25),
 *         { x: width - 20, y: 25},
 *         { x: width - 20, y: height - 55}
 *       );
 *       noFill()
 *       bezier(
 *         new Point(0, height - 20),
 *         new Point(width - 20, height - 20),
 *         { x: 20, y: 20},
 *         { x: width, y: 20}
 *       );
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} points
 */
declare function bezier(...points: any): void;
/**
 *
 * @param {*} points
 * @param {*} open
 */
declare function bspline(points: any, open?: any): void;
/**
 * Draw a circle with radius `r` at (x,y).
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       circle(width/2, height/2, 80);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
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
