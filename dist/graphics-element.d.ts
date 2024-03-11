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
 *       setTextAlign(CENTER, MIDDLE);
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
 *       setTextAlign(CENTER, MIDDLE);
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
 *       setTextAlign(CENTER, MIDDLE);
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
 *       setTextAlign(CENTER, MIDDLE);
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
 *       setTextAlign(CENTER, MIDDLE);
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
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`red`);
 *       setStroke(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`stroked`, width/2, height/2 - 25);
 *       noTextStroke();
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
 */
declare function addSlider(propLabel: string, options: *): void;
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
 *       setTextAlign(CENTER, MIDDLE);
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
 */
declare function addButton(label: *, onClick: *): HTMLButtonElement;
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
 *       setTextAlign(CENTER, MIDDLE);
 *       text(`click to clear`, width/2, height/2);
 *     }
 *     function pointerDown() {
 *       clearButtons();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
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
 *       arc(width/2 + 30, height/2 - 40, 40, 0, 0.66*TAU);
 *       arc(width/2 - 30, height/2 + 20, 40, 0, 0.66*TAU, true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function arc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  drawWedge: boolean,
): void;
declare function arc(
  point: PointLike,
  radius: number,
  startAngle: number,
  endAngle: number,
  drawWedge: boolean,
): void;
/**
 * Draw a pair of horizontal and vertical axes
 *
 */
declare function axes(
  hLabel: *,
  hs: *,
  he: *,
  vLabel: *,
  vs: *,
  ve: *,
  hsLabel: *,
  heLabel: *,
  vsLabel: *,
  veLabel: *,
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
 */
declare function bezier(eight: *): void;
declare function bezier(four: *): void;
/**
 * Draw a B-spline using four or more Point or
 * Point-likes that implement:
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
 *       // CODE GOES HERE
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function bspline(eight: *): void;
declare function bspline(four: *): void;
/**
 * Draw a circle with radius `r` at (x,y).
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
 *       circle(width/2, height/2, 80);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function circle(x: *, y: *, r: *): void;
declare function circle(p: *, r: *): void;
/**
 * Clear the canvas, and set it to a specific (CSS) colour.
 * If no `noGrid()` call was made, this will then also draw
 * the background grid.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`pink`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function clear(colour: *): void;
/**
 * Counterpart to start(), finalizes the current shape and
 * colours it. If `close` is true, it will close the path
 * before colouring.
 *
 * If `noFill()` is in effect, the shape will not be filled.
 * if `noStroke()` is in effect, the shape outline will not be coloured.
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
 *       setFill(`gold`);
 *       start();
 *       vertex(0,height/2);
 *       vertex(width/2, 0);
 *       vertex(width, height/2);
 *       vertex(width/2, height);
 *       end(true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function end(close: *): void;
/**
 * Draw an image in a given location with an optional
 * width and height. If omitted, the width and height
 * will be the image's own dimensions. Note that the
 * image may be either a URL, or an <img> element.
 *
 * Note that this is an async function: if it is important
 * that nothing gets drawn until the image has been drawn,
 * remember to `await` its call.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     async function draw() {
 *       clear(`white`);
 *       await image(`https://dummyimage.com/100x100`, 50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function image(img: *, x: *, y: *, w: *, h: *): { Image };
declare function image(img: *, p: *, w: *, h: *): { Image };
/**
 * Draw a line from one coordinate to another.
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
 *       range(0,height,20, (i) => line(0, 0, width, i));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function line(x1: *, y1: *, x2: *, y2: *): void;
declare function line(p1: *, p2: *): void;
/**
 * Plot a y=f(x) function. The input to the function
 * will span the interval [a,b] using the indicated
 * number of steps, and the re sult may be scaled both
 * in the x and y direction in order to draw something
 * that you can actually see (e.g. if you're plotting
 * to the domain [0,1] you wouldn't be able to see the
 * result without scaling).
 *
 * This function is aware of, and will plot, discontinuities.
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
 *       noFill();
 *       setStroke(`black`);
 *       translate(0, height/2);
 *       plot((x) => cos(x)**2/sin(x), 0, TAU, width/TAU, height/2)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function plot(f: *, a: *, b: *, steps: *, xscale: *, yscale: *): void;
/**
 * Plot a 2D graph using a collection of any-dimensional data,
 * by indicating which dimension should be treated as the `x`
 * and which dimension should be treated as the `y`.
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
 *       noFill();
 *       translate(0, height/2);
 *
 *       setStroke(`darkgreen`);
 *       let data = array(width, (_,i) => [i, height/2 * sin(i/25)]);
 *       plotData(data, 0, 1);
 *
 *       setStroke(`purple`);
 *       data = array(width, (_,i) => ({
 *         meep: i,
 *         moop: height/2 * cos(i/25)
 *       }));
 *       plotData(data, `meep`, `moop`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function plotData(data: *, x: *, y: *): void;
/**
 * Draw a point (either from x/y or point-like).
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
 *       translate(width/2, height/2);
 *       range(0, TAU, (a) => {
 *         point(40 * cos(a), 40 * sin(a));
 *       });
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function point(x: *, y: *): void;
declare function point(p: *): void;
/**
 * Draw a rectangle at the specified coordinate, with
 * the specific width and height.
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
 *       setFill(`red`);
 *       rect(40, 40, width - 80, height - 80);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function rect(x: *, y: *, w: *, h: *): void;
declare function rect(p: *, w: *, h: *): void;
/**
 * draw a cardinal spline with virtual start and end point
 *
 */
declare function spline(points: *, virtual: *, tightness: *, T: *): void;
/**
 * Starts a (new) shape.
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
 *       setFill(`gold`);
 *       start();
 *       vertex(0,height/2);
 *       vertex(width/2, 0);
 *       vertex(width, height/2);
 *       vertex(width/2, height);
 *       end(true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function start(): void;
/**
 * Draw some text to the screen. Its placement is
 * determined by both the coordinate provided, and
 * the x/y alignment provided. Valid `xAlign` values
 * are:
 *
 *   CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 *   END - the text anchor is on the right for LTR text, and on the left for RTL text.
 *   LEFT - the text anchor is on the left side of the text. all text is to the right.
 *   RIGHT - the text anchor is on the right side of the text. All text is to the left.
 *   START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 * Valid `yAlign` values are:
 *
 *   ALPHABETIC - standard text alignment
 *   BOTTOM - the text is aligned to the bottom of the bounding box
 *   HANGING - relevant for Tibetan and other Indic scripts.
 *   IDEOGRAPHIC - relevant for ideographic CJKV text.
 *   MIDDLE - The vertical equivalent of "center".
 *   TOP - The text is aligned to the top of the typographic "em square".
 *
 * Note that the primary text colour uses the fill colour. If text
 * stroking is enabled, the the text outline will be coloured using
 * the current stroke colour.
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
 *       setFontSize(25);
 *       text("normal text", width/2, 60, CENTER, CENTER);
 *       noFill();
 *       setTextStroke(1);
 *       text("unfilled text", width/2, 100, CENTER, CENTER);
 *       setStroke(`red`);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 140, CENTER, CENTER);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function text(str: *, x: *, y: *, xAlign: *, yAlign: *): void;
declare function text(str: *, p: *, xAlign: *, yAlign: *): void;
/**
 * Draw a triangle.
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
 *       setFill(`red`);
 *       triangle(width/2, 30, 1/4 * width, 160, 3/4 * width, 110);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function triangle(x1: *, y1: *, x2: *, y2: *, x3: *, y3: *): void;
declare function triangle(p1: *, p2: *, p3: *): void;
/**
 * Add a vertex to the currently active shape.
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
 *       setFill(`red`);
 *       start();
 *       vertex(width/2, 30);
 *       vertex(1/4 * width, 160);
 *       vertex(3/4 * width, 110);
 *       end();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function vertex(x: *, y: *): void;
declare function vertex(p: *): void;
/**
 * Create an array of specified length, optionally
 * filled using the same kind of function you'd normall
 * use with .map()
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
 *       noFill();
 *       translate(0, height/2);
 *       let data = array(width, (_,i) => [i, height/2 * sin(i/25)]);
 *       plotData(data, 0, 1);
 *      }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function array(len: *, fillFunction: *): void;
/**
 * Empty the list of movable points in your graphic.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`lock`, () => {
 *         clearMovable();
 *         redraw();
 *       });
 *     }
 *     function draw() {
 *       clear(`white`);
 *       for(let p of points) {
 *         setColor(isMovable(p) ? `red` : `grey`);
 *         point(p);
 *       }
 *     }
 *     function pointerDown(x,y) {
 *       if (currentPoint) return;
 *       const p = new Point(x,y);
 *       points.push(p);
 *       setMovable(p);
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function clearMovable(): void;
/**
 * Create a copy of the current canvas element
 * for use somewhere else in your own code.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`pink`);
 *     }
 *     function pointerDown(x,y) {
 *       document.dispatchEvent(
 *         new CustomEvent(`graphics:update`, {
 *           detail: {
 *             canvas: copy()
 *           }
 *         })
 *       );
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function copy(): void;
/**
 * Generates a color based on the HSL color space.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(color(45, 80, 90));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function color(hue: *, saturation: *, lightness: *, opacity: *): void;
/**
 * Mark a specific color as the highlight color,
 * which causes the graphic to redraw with that
 * color replaced by whichever color you picked
 * as highlight color.
 *
 * Note that you can only use named (CSS) colors
 * with this function.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setHighlightColor(`lime`);
 *     }
 *     function draw() {
 *       clear();
 *       setColor(`red`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       text("let's go", width/2, height/2)
 *     }
 *     function pointerActive(state) {
 *       if (state) highlight(`red`);
 *       else highlight(false);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function highlight(color: *): void;
/**
 * Check whether a point is registered as movable.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`lock`, () => {
 *         clearMovable();
 *         redraw();
 *       });
 *     }
 *     function draw() {
 *       clear(`white`);
 *       for(let p of points) {
 *         setColor(isMovable(p) ? `red` : `grey`);
 *         point(p);
 *       }
 *     }
 *     function pointerDown(x,y) {
 *       if (currentPoint) return;
 *       const p = new Point(x,y);
 *       points.push(p);
 *       setMovable(p);
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function isMovable(): true;
/**
 * Get the number of milliseconds that this
 * graphic has been running.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000)|0;
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function millis(): void;
/**
 * Pause the graphic if its currently playing.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *     function pointerActive(state) {
 *       if(state) {
 *         pause();
 *       } else {
 *         play();
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function pause(): void;
/**
 * Start playing your graphic, meaning it will call draw()
 * at whatever rate the requestAnimationFrame loop is
 * allowed to run on your computer.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     let fps = 0;
 *     let checked = false;
 *     let lastFrameCheck = 0;
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`fps: ${fps}`, width/2, height/2)
 *       if (seconds.endsWith(`.0`)) {
 *         if (!checked) {
 *           checked = true;
 *           fps = frame - lastFrameCheck;
 *           lastFrameCheck = frame;
 *         }
 *       } else {
 *         checked = false;
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function play(): void;
/**
 * Generate a random colour. Note that this function
 * allows you to get "the currently generated random
 * colour" in different opacities by calling the function
 * with an opacity value, and `false` as cycle argument.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(randomColor());
 *     }
 *     function pointerDown() {
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 */
declare function randomColor(opacity: *, cycle: *): void;
/**
 * An alternative to writing for loops, because
 * no one wants to constantly write var allocations
 * that only live for the duration of a loop.
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
 *       translate(width/2, height/2);
 *       range(0, TAU, (a) => point(40 * cos(a), 40 * sin(a)));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 */
declare function range(start: *, end: *, step?: *, runFunction: *): void;
/**
 * Mark one or more points as movable, meaning
 * that the user can reposition the point around on
 * the canvas by touch/click-dragging.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *     function setup() {
 *       setSize(200, 200);
 *       for (let i = 40; i < 200; i += 20) {
 *         points.push(new Point(i - 20, 120));
 *       }
 *       setMovable(...points);
 *     }
 *     function draw() {
 *       clear();
 *       noFill();
 *       setStroke(`purple`);
 *       bspline(...points);
 *       for(let p of points) point(p);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setMovable(points: *): void;
/**
 * Restore the graphics context (transforms,
 * current colors, etc) to what they were
 * when save() was called.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       setColor(`blue`);
 *       line(0,0,80,0);
 *       save();
 *       setColor(`darkgreen`)
 *       range(0, 5, 1, (a) => {
 *         rotate(PI/8);
 *         line(0,0,80,0);
 *       });
 *       restore();
 *       line(-20,0,-80,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function restore(): void;
/**
 * Save the current graphics context (transforms,
 * current colors, etc) so that those can be restored
 * after changing them.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       setColor(`blue`);
 *       line(0,0,80,0);
 *       save();
 *       setColor(`darkgreen`)
 *       range(0, 5, 1, (a) => {
 *         rotate(PI/8);
 *         line(0,0,80,0);
 *       });
 *       restore();
 *       line(-20,0,-80,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function save(): void;
/**
 * Convert the current canvas into an data URL
 * that represents a PNG image.
 */
declare function toDataURL(): void;
/**
 * If the graphic is currently playing, pause it,
 * and if it's paused, play it.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *     function pointerActive(state) {
 *       togglePlay();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function togglePlay(): void;
/**
 * Project a 3D coordinate to 2D.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function project(x: *, y: *, z: *, p: *): void;
/**
 * Set the projector's x, y, and z axis rotation
 * in radians. Note that these are applied in order.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *       play();
 *     }**
 *     function draw() {
 *       clear(`white`);
 *       const m = millis() / 5000;
 *       rotateProjector(m, 2 * m, 3 * m);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function rotateProjector(x: *, y: *, z: *): void;
/**
 * Set the project parameters. Currently, only
 * cabinet project is supported, which accepts
 * the following parameters:
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setProjector(
  xOffset: number,
  yOffset: number,
  scale: number,
  cabinet: number,
): void;
/**
 * Set a border around the canvas.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setBorder(10, `red`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setBorder(width: *, color: *): void;
/**
 * Set the current stroke and fill colour at
 * the same time.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       setColor(`blue`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setColor(color: *): void;
/**
 * Change the cursor to a specific icon:
 *
 *  AUTO - use whatever the browser would otherwise use
 *  CROSS - use a cross-hair icon
 *  POINTER - use the "pointer" icon that is also used for clickable links
 *
 * Use any other string found over on the MDN cursor article to set a cursor not covered by the above constants.
 *
 */
declare function setCursor(type: *): void;
/**
 * Set the current fill colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       setStroke(`black`);
 *       setFill(`red`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setFill(color: *): void;
/**
 *
 */
declare function setFont(font: *): void;
/**
 *
 */
declare function setFontFamily(name: *): void;
/**
 *
 */
declare function setFontSize(px: *): void;
/**
 *
 */
declare function setFontWeight(val: *): void;
/**
 * Set the background grid spacing and colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *      function setup() {
 *       setSize(200, 200);
 *       setGrid(20, `lavender`);
 *     }
 *     function draw() {
 *       clear(`white`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setGrid(spacing: *, color: *): void;
/**
 * Set the color that should be used to replace whatever
 * highlight() marked as the "to highlight" color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setHighlightColor(`lime`);
 *     }
 *     function draw() {
 *       clear();
 *       setColor(`red`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       text("let's go", width/2, height/2)
 *     }
 *     function pointerActive(state) {
 *       if (state) highlight(`red`);
 *       else highlight(false);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setHighlightColor(color: *): void;
/**
 * Set the line dash property. See the following MDN article for the details:
 *
 * https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash
 *
 */
declare function setLineDash(values: any[]): void;
/**
 * Set the line width in pixels.
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
 *       range(1, 10, (i) => {
 *         setLineWidth(i);
 *         line(20, i * 20, 180, i * 20);
 *       })
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setLineWidth(width: *): void;
/**
 * Set the current stroke colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       setStroke(`black`);
 *       setFill(`red`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setStroke(color: *): void;
/**
 * Set the current text alignment values.
 *
 * Valid `xAlign` values are:
 *
 *   CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 *   END - the text anchor is on the right for LTR text, and on the left for RTL text.
 *   LEFT - the text anchor is on the left side of the text. all text is to the right.
 *   RIGHT - the text anchor is on the right side of the text. All text is to the left.
 *   START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 * Valid `yAlign` values are:
 *
 *   ALPHABETIC - standard text alignment (default)
 *   BOTTOM - the text is aligned to the bottom of the bounding box
 *   HANGING - relevant for Tibetan and other Indic scripts.
 *   IDEOGRAPHIC - relevant for ideographic CJKV text.
 *   MIDDLE - The vertical equivalent of "center".
 *   TOP - The text is aligned to the top of the typographic "em square".
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
 *       setFontSize(20);
 *       setColor(`black`);
 *       line(width / 2, 0, width / 2, height);
 *       line(0, height / 2, width, height / 2);
 *       setTextAlign(CENTER, MIDDLE);
 *       text("center middle", width / 2, height/2);
 *       line(0, height / 2 - 50, width, height / 2 - 50);
 *       setTextAlign(RIGHT, TOP);
 *       text("right top", width / 2, height/2 - 50);
 *       line(0, height / 2 + 50, width, height / 2 + 50);
 *       setTextAlign(LEFT, BOTTOM);
 *       text("left bottom", width / 2, height/2 + 50);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setTextAlign(xAlign: *, yAlign: *): void;
/**
 * Set the text outline stroking properties.
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
 *       setFontSize(25);
 *       setTextStroke(`red`, 1);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 80, CENTER, CENTER);
 *       setFontSize(65);
 *       setTextStroke(`red`, 3);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 140, CENTER, CENTER);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function setTextStroke(color: *, width: *): void;
/**
 * Reset the coordinate transform matrix.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       setColor(`red`);
 *       translate(50,50);
 *       line(0,0,100,0);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       point(10,0);
 *       rotate(PI/4);
 *       point(10,0);
 *       line(0,0,100,0);
 *       setColor(`blue`);
 *       rotate(-PI/6)
 *       point(100,0);
 *       scale(0.5, 0.5);
 *       point(100,0);
 *       line(100,0,200,0);
 *       resetTransform();
 *       setColor(`black`);
 *       line(0,3,100,3);
 *       point(0,3);
 *       point(10,3);
 *       point(100,3);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
declare function resetTransform(): void;
/**
 * Rotate the coordinate system wrt the current origin.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       setColor(`black`);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       line(0,0,20,20);
 *       point(20,20);
 *       rotate(PI/4);
 *       line(0,0,20,20);
 *       point(20,20);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function rotate(angle: *): void;
/**
 * Scale the coordinate system wrt the current origin.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       setColor(`black`);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       line(0,0,20,20);
 *       point(20,20);
 *       rotate(PI/4);
 *       scale(2);
 *       line(0,0,20,20);
 *       point(20,20);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function scale(x: *, y?: *): void;
/**
 * Convert a screen (e.g. browser) coordinate into its
 * corresponding "transformed" coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       rotate(PI/4);
 *       scale(0.5);
 *       if (pointer.active) {
 *         setColor(`red`);
 *         point(pointer.x, pointer.y);
 *         setColor(`blue`);
 *         point(screenToWorld(pointer.x, pointer.y));
 *       }
 *     }
 *     function pointerMove() {
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function screenToWorld(x: *, y: *, p: *): void;
/**
 * Set the current transform matrix, based on applying:
 *
 *       | a b c |
 *   m = | d e f |
 *       | 0 0 1 |
 *
 * With the parameters defaulting to the identity matrix.
 *
 */
declare function transform(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): void;
/**
 * Translate the coordinate system by some amount of x and y units.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       point(0,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function translate(x: *, y: *, p: *): void;
/**
 * Convert an in-canvas "transformed" coordinate into its
 * corresponding "screen" (i.e. browser canvas offset) coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       translate(width / 2, height / 2);
 *       rotate(millis() / 2000);
 *       const p = new Point(30, 0);
 *       const s = worldToScreen(p);
 *       setFontSize(25);
 *       point(p);
 *       text(`${p.x},${p.y}`, p.x + 10, p.y + 10);
 *       resetTransform();
 *       setFontSize(16);
 *       text(`${s.x.toFixed()},${s.y.toFixed()}`, s.x - 25, s.y - 15);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 */
declare function worldToScreen(x: *, y: *): p;
declare function worldToScreen(p: *): p;
