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
 * @param {boolean} trueOrFalse
 */
declare function pointerActive(trueOrFalse: boolean): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerDown(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerUp(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerClick(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerMove(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerDrag(x: number, y: number): void;
/**
 *
 * @param {string} key
 * @param {boolean} shift
 * @param {boolean} alt
 * @param {boolean} ctrl
 * @param {boolean} meta
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
 * @param {string} key
 * @param {boolean} shift
 * @param {boolean} alt
 * @param {boolean} ctrl
 * @param {boolean} meta
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
declare type PointLike = { x: number; y: number };
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
 * The current frame number
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#frame
 */
declare const frame: number;
/**
 * The number of milliseconds since the last frame.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#frameDelta
 */
declare const frameDelta: number;
/**
 * The height of the canvas in pixels
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#height
 */
declare const height: number;
/**
 * The width of the canvas in pixels
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#width
 */
declare const width: number;
/**
 * The current play state
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#playing
 */
declare const playing: boolean;
/**
 * The `pointer` object represents the mouse cursor (when using
 *  a mouse) or finger position (for touch devices), and models
 *  several aspects:
 *
 *  - `active` (boolean) Whether the pointer is even on or over the canvas.
 *  - `x` (number) The pointer's x offset in pixels with respect to the canvas
 *  - `y` (number) The pointer's y offset in pixels with respect to the canvas
 *  - `down` (boolean) Whether the pointer is "engaged" or not
 *  - `drag` (boolean) Whether a click/touch-drag is in progress
 *  - `mark` ({x,y}) When dragging, this represents the original coordinate of the pointer "down" event
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#pointer
 */
declare const pointer: object;
/**
 * If any points were registered as movable, and the pointer is
 *  near enough to a movable point, this value will point to
 *  that movable point, or `false` if the pointer is not near
 *  any movable point (or, of course, there are no movable points)
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#currentMovable
 */
declare const currentMovable: PointLike | false;
/**
 * The `keyboard` object is a truth table that can be checked to
 *  see if any key is currently pressed, and if so, when that
 *  keypress was initiated, by storing:
 *
 *  ```
 *  {
 *    [key:string]: datetime
 *  }
 *  ```
 *
 *  When a key is released, its mapping is removed entirely,
 *  rather than it being set to a falsey value.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#keyboard
 */
declare const keyboard: object;
/**
 * The ratio of a circle's circumference to its diameter.
 *
 *  See https://en.wikipedia.org/wiki/Pi
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#PI
 */
declare const PI: number;
/**
 * The base for the natural logarithm.
 *
 *  See https://en.wikipedia.org/wiki/E_(mathematical_constant)
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#E
 */
declare const E: number;
/**
 * A very small value for performing imprecise math operations
 *  such as checking whether a value is approximately the same
 *  as some other value.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#epsilon
 */
declare const epsilon: number;
/**
 * A very large value that can still be used to draw things
 *  on the canvas (such as lines from -huge to +huge).
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#huge
 */
declare const huge: number;
/**
 * The ratio of a circle's circumference to its radius, i.e. 2*PI
 *
 *  See https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#TAU
 */
declare const TAU: number;
/**
 * The constant for indicating a projector should be a "cabinet" projector,
 *  i.e. a projector without perspective, where coordinates further away
 *  are draw progressively more up and right, similar to the kind of pictures
 *  one might find in an instruction leaflet for building a cabinet.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#CABINET
 */
declare const CABINET: Symbol;
/**
 * The constant for indicating a projector should be a "normal" homogeneous
 *  projector, i.e. projection with a "point at infinity" and normal perspective
 *  applied.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#HOMOGENEOUS
 */
declare const HOMOGENEOUS: Symbol;
/**
 * Ensure that there is no border around the canvas element.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noBorder
 */
declare function noBorder(): void;
/**
 * Disable both stroke and fill color.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noColor
 */
declare function noColor(): void;
/**
 * Hide the cursor.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noCursor
 */
declare function noCursor(): void;
/**
 * Disable the fill color.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noFill
 */
declare function noFill(): void;
/**
 * Disable the default grid background.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noGrid
 */
declare function noGrid(): void;
/**
 * Set the line stroke to "solid".
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noLineDash
 */
declare function noLineDash(): void;
/**
 * Disable the stroke color.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noStroke
 */
declare function noStroke(): void;
/**
 * Disable text stroking, but not regular shape stroking.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noTextStroke
 */
declare function noTextStroke(): void;
/**
 * Add a slider to your figure, allowing users to control
 *  a variable in your graphics code directly by interacting
 *  with that on-page slider, which is especially important if
 *  you want your graphics to be useable by users who don't
 *  have, or cannot use, a mouse.
 *
 *  The `propLabel` value should be the name of the variable
 *  that your graphics code uses, and should _not_ be "preallocated"
 *  in your code with a const, let, or var: it will automatically
 *  get added as part of the source loading process.
 *
 *  The options object accepts the following properties and values:
 *
 *  - min - the slider's minimum value, defaults to 0
 *  - max - the slider's maximum value, defaults to 1
 *  - step - the step size, defaults to (max - min)/10
 *  - value - the initial value, defaults to (max + min)/2
 *  - classes - the CSS classes that will be used, defaults to `"slider"`
 *  - transform - a value preprocessor  defaults to (v) => v
 *
 *  The `transform` pre-processor runs after the user updates
 *  the slider, but before its value gets assigned to your variable,
 *  so that you can map it to something else (for instance, numbers
 *  in one range to numbers in a completely different range, or even
 *  numbers to strings or entire objects)
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#addSlider
 */
declare function addSlider(varName: string, options: object): HTMLInputElement;
/**
 * Remove all sliders for your figure from the page.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#clearSliders
 */
declare function clearSliders(): void;
/**
 * Add a button below your figure that can trigger event-based
 *  code, which is especially important if you want your graphics
 *  to be useable by users who don't have, or cannot use, a mouse.
 *
 *  onClick is similar to the standard JS event handler, except
 *  that the call argument is a reference to your button, not
 *  the click event.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#addButton
 */
declare function addButton(label: string, onClick: Function): HTMLButtonElement;
/**
 * Remove all buttons for your figure from the page.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#clearButtons
 */
declare function clearButtons(): void;
/**
 * Draw a circular arc with radius `r` at (x,y),
 *  starting at angle `s` and ending at angle `e`.
 *  If `wedge` is true, this will draw a closed
 *  shape that is anchored at (x,y). If omitted
 *  or explicitly set to false, this will draw
 *  an open shape with a fill that connects the
 *  first and last point on the arc, but no closing
 *  stroke.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#arc
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
 * Draw a pair of horizontal and vertical axes.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#axes
 */
declare function axes(
  hLabel: string,
  hs: number,
  he: number,
  vLabel: string,
  vs: number,
  ve: number,
  hsLabel?: string,
  heLabel?: string,
  vsLabel?: string,
  veLabel?: string,
): void;
/**
 * Draw one or more Bezier curves from an array
 *  of Point or Point-likes that implement:
 *
 *  ```
 *  {
 *    x: number
 *    y: number
 *  }
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#bezier
 */
declare function bezier(
  ...coordinates: number[8],
  ...additionalCoordinates: number[6n]
): void;
declare function bezier(
  ...coordinates: PointLike[4],
  ...additionalCoordinates: PointLike[3n]
): void;
/**
 * Draw a B-spline using four or more Point or
 *  Point-likes that implement:
 *
 *  ```
 *  {
 *    x: number
 *    y: number
 *  }
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#bspline
 */
declare function bspline(
  ...coordinates: number[8],
  ...additionalCoordinates: number[2n]
): void;
declare function bspline(
  ...coordinates: PointLike[4],
  ...additionalCoordinates: PointLike[n]
): void;
/**
 * Draw a circle with radius `r` at `x,y`.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#circle
 */
declare function circle(x: number, y: number, r: number): void;
declare function circle(p: PointLike, r: number): void;
/**
 * Clear the canvas, and set it to a specific (CSS) colour.
 *  If no `noGrid()` call was made, this will then also draw
 *  the background grid.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#clear
 */
declare function clear(color?: color): void;
/**
 * Counterpart to start(), finalizes the current shape and
 *  colours it. If `close` is true, it will close the path
 *  before colouring.
 *
 *  If `noFill()` is in effect, the shape will not be filled.
 *  if `noStroke()` is in effect, the shape outline will not be coloured.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#end
 */
declare function end(close?: boolean): void;
/**
 * Draw an image in a given location with an optional
 *  width and height. If omitted, the width and height
 *  will be the image's own dimensions. Note that the
 *  image may be either a URL, or an <img> element.
 *
 *  Note that this is an async function: if it is important
 *  that nothing gets drawn until the image has been drawn,
 *  remember to `await` its call.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#image
 */
declare function image(
  imgOrURL: Image | string,
  x: number,
  y: number,
  w: number,
  h: number,
): Image;
declare function image(
  imgOrURL: Image | string,
  p: PointLike,
  w: number,
  h: number,
): Image;
/**
 * Draw a line from one coordinate to another.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#line
 */
declare function line(x1: number, y1: number, x2: number, y2: number): void;
declare function line(p1: PointLike, p2: PointLike): void;
/**
 * Plot a y=f(x) function. The input to the function
 *  will span the interval [a,b] using the indicated
 *  number of steps, and the re sult may be scaled both
 *  in the x and y direction in order to draw something
 *  that you can actually see (e.g. if you're plotting
 *  to the domain [0,1] you wouldn't be able to see the
 *  result without scaling).
 *
 *  This function is aware of, and will plot, discontinuities
 *  using the standard open circle notation, unless instructed
 *  not to do so using the `ignoreDiscontinuity` boolean flag.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#plot
 */
declare function plot(
  f: Function,
  a?: number,
  b?: number,
  steps?: number,
  xscale?: number,
  yscale?: number,
  ignoreDiscontinuity?: boolean,
): void;
/**
 * Plot a 2D graph using a collection of any-dimensional data,
 *  by indicating which dimension should be treated as the `x`
 *  and which dimension should be treated as the `y`. If no `x`
 *  and `y` are provided, `data` will be treated a 1D array and
 *  will plot with the array index as `x` and element at that
 *  index as `y`.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#plotData
 */
declare function plotData(
  data: object[],
  x?: number | string,
  y?: number | string,
): void;
/**
 * Draw a point (either from x/y or point-like).
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#point
 */
declare function point(x: number, y: number): void;
declare function point(p: PointLike): void;
/**
 * Draw a closed polygon from an array of point likes or number arrays.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#poly
 */
declare function poly(coordinates: number[]): void;
/**
 * Draw a rectangle at the specified coordinate, with
 *  the specific width and height.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#rect
 */
declare function rect(x: number, y: number, w: number, h: number): void;
declare function rect(p: PointLike, w: number, h: number): void;
/**
 * Draw a cardinal (hermite) spline that passes through each
 *  point provided, using a mathematically virtual start and
 *  end to ensure the curve starts and ends at the provided
 *  start and end point. This can be bypassed by setting
 *  the `virtual` argument to `false`.
 *
 *  Additionally, the spline's tightness, which controls
 *  how "bendy" the spline is (the tighter the spline,
 *  the sharper bends become) can be controlled by setting
 *  the `tightness` value.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#spline
 */
declare function spline(
  ...points: PointLike[],
  virtual?: boolean,
  tightness?: number,
): void;
/**
 * Starts a (new) shape.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#start
 */
declare function start(): void;
/**
 * Draw some text to the screen. Its placement is
 *  determined by both the coordinate provided, and
 *  the x/y alignment provided. Valid `xAlign` values
 *  are:
 *
 *  - CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 *  - END - the text anchor is on the right for LTR text, and on the left for RTL text.
 *  - LEFT - the text anchor is on the left side of the text. all text is to the right.
 *  - RIGHT - the text anchor is on the right side of the text. All text is to the left.
 *  - START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 *  Valid `yAlign` values are:
 *
 *  - ALPHABETIC - standard text alignment
 *  - BOTTOM - the text is aligned to the bottom of the bounding box
 *  - HANGING - relevant for Tibetan and other Indic scripts.
 *  - IDEOGRAPHIC - relevant for ideographic CJKV text.
 *  - MIDDLE - The vertical equivalent of "center".
 *  - TOP - The text is aligned to the top of the typographic "em square".
 *
 *  Note that the primary text colour uses the fill colour. If text
 *  stroking is enabled, the the text outline will be coloured using
 *  the current stroke colour.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#text
 */
declare function text(
  str: string,
  x: number,
  y: number,
  xAlign?: string,
  yAlign?: string,
): void;
declare function text(
  str: string,
  p: PointLike,
  xAlign?: string,
  yAlign?: string,
): void;
/**
 * Draw a triangle.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#triangle
 */
declare function triangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
): void;
declare function triangle(p1: PointLike, p2: PointLike, p3: PointLike): void;
/**
 * Add a vertex to the currently active shape.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#vertex
 */
declare function vertex(x: number, y: number): void;
declare function vertex(p: PointLike): void;
/**
 * Create an array of specified length, optionally filled using a
 *  function that takes the element index as single input argument.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#array
 */
declare function array(length: number, fillFunction?: Function): void;
/**
 * Empty the list of movable points in your graphic.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#clearMovable
 */
declare function clearMovable(): void;
/**
 * Create a copy of the current canvas element
 *  for use somewhere else in your own code.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#copy
 */
declare function copy(): HTMLCanvasElement;
/**
 * Generates a color based on the HSL color space.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#color
 */
declare function color(
  hue: number,
  saturation: number,
  lightness: number,
  opacity: number,
): string;
/**
 * Find an HTML element inside your graphics-element
 *  by query selector. This is equivalent to:
 *
 *  ```
 *  yourElement.querySelector(qs)
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#find
 */
declare function find(querySelector: string): HTMLElement | null;
/**
 * Find all HTML elements inside your graphics-element
 *  that match a given query selector. This is equivalent to:
 *
 *  ```
 *  Array.from(yourElement.querySelectorAll(qs))
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#findAll
 */
declare function findAll(querySelector: string): HTMLElement[];
/**
 * Mark a specific color as the highlight color,
 *  which causes the graphic to redraw with that
 *  color replaced by whichever color you picked
 *  as highlight color.
 *
 *  Note that you can only use named (CSS) colors
 *  with this function.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#highlight
 */
declare function highlight(color: color | boolean): void;
/**
 * Check whether a point is registered as movable.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#isMovable
 */
declare function isMovable(The: PointLike): boolean;
/**
 * Get the number of milliseconds that this
 *  graphic has been running.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#millis
 */
declare function millis(): number;
/**
 * Pause the graphic if its currently playing.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#pause
 */
declare function pause(): void;
/**
 * Start playing your graphic, meaning it will call draw()
 *  at whatever rate the requestAnimationFrame loop is
 *  allowed to run on your computer.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#play
 */
declare function play(): void;
/**
 * Generate a random colour. Note that this function
 *  allows you to get "the currently generated random
 *  colour" in different opacities by calling the function
 *  with an opacity value, and `false` as cycle argument.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#randomColor
 */
declare function randomColor(opacity: number, cycle?: number): void;
/**
 * An alternative to writing for loops, because
 *  no one wants to constantly write var allocations
 *  that only live for the duration of a loop.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#range
 */
declare function range(
  start: number,
  end: number,
  step?: number,
  runFunction: Function,
): void;
/**
 * Safely trigger a new draw pass. If the graphic is running
 *  in animated mode, or a redraw() is triggered _during_ a
 *  redraw(), this call will do nothing.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#redraw
 */
declare function redraw(): void;
/**
 * Restore the graphics context (transforms,
 *  current colors, etc) to what they were
 *  when save() was called.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#restore
 */
declare function restore(): void;
/**
 * Mark one or more points as movable, meaning
 *  that the user can reposition the point around on
 *  the canvas by touch/click-dragging.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setMovable
 */
declare function setMovable(points: PointLike[n]): void;
/**
 * Set (or change) the graphic's size. Note that your width
 *  and height values will get rounded to integer values.
 *
 *  Note that `setSize` will immediately trigger a redraw,
 *  whether you want it to or not, because changing canvas
 *  dimensions clears the canvas, necessitating a redraw.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setSize
 */
declare function setSize(width: number, height: number): void;
/**
 * Save the current graphics context (transforms,
 *  current colors, etc) so that those can be restored
 *  after changing them.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#save
 */
declare function save(): void;
/**
 * Convert the current canvas into an data URL
 *  that represents a PNG image.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#toDataURL
 */
declare function toDataURL(): string;
/**
 * If the graphic is currently playing, pause it,
 *  and if it's paused, play it.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#togglePlay
 */
declare function togglePlay(): boolean;
/**
 * Get the absolute value for some input
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#abs
 */
declare function abs(v: number): number;
/**
 * The inverse cosine function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#acos
 */
declare function acos(v: number): number;
/**
 * The hyperbolic inverse cosine function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#acosh
 */
declare function acosh(input: number): number;
/**
 * The inverse sine function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#asin
 */
declare function asin(input: number): number;
/**
 * The hyperbolic inverse sine function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#asinh
 */
declare function asinh(input: number): number;
/**
 * The inverse tangent function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#atan
 */
declare function atan(input: number): number;
/**
 * The "atan2" function
 *
 *  See https://en.wikipedia.org/wiki/Atan2
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#atan2
 */
declare function atan2(input: x): number;
/**
 * The hyperbolic inverse tangent function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#atanh
 */
declare function atanh(input: number): number;
/**
 * The cube root function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#cbrt
 */
declare function cbrt(input: number): number;
/**
 * The "round up to the nearest integer" function.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#ceil
 */
declare function ceil(input: number): number;
/**
 * Get the number of leading zero bits in the 32-bit binary representation of a number
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#clz32
 */
declare function clz32(input: number): number;
/**
 * The cosine function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#cos
 */
declare function cos(input: number): number;
/**
 * The hyperbolic cosine function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#cosh
 */
declare function cosh(input: number): number;
/**
 * The exponent function, that is: e^x
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#exp
 */
declare function exp(input: number): number;
/**
 * The "round down to the nearest integer" function.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#floor
 */
declare function floor(input: number): number;
/**
 * Round a number to the nearest 32 bit, rather than the
 *  standard JS 64 bit, floating point representation.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#fround
 */
declare function fround(input: number): number;
/**
 * The Euclidean hypotenuse function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#hypot
 */
declare function hypot(...input: number[]): number;
/**
 * The 32 bit integer multiplication function.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#imul
 */
declare function imul(a: number, b: number): number;
/**
 * The natural logarithm function, i.e. the base-E logarithm
 *
 *  (Note that in JS this function is called "log" rather than "ln")
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#ln
 */
declare function ln(input: number): number;
/**
 * The "common logarithm" function, i.e. the base-10 logarithm.
 *
 *  (Note that in JS this function is called "log10" rather than "log")
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#log
 */
declare function log(input: number): number;
/**
 * The binary logarithm function, i.e. the base-2 logarithm.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#log2
 */
declare function log2(input: number): number;
/**
 * Find the maximum value in a set of numbers
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#max
 */
declare function max(...input: number): number;
/**
 * Find the minimum value in a set of numbers
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#min
 */
declare function min(...input: number): number;
/**
 * The power function.
 *
 *  Note that this function is a holdover from before JS
 *  had the `**` operator for performing this calculation.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#pow
 */
declare function pow(a: number, b: number): number | NaN;
/**
 * The "round to the nearest integer" function, rounding any
 *  value [x.0, x.4999...] to x, and any value [x.5, x.999...]
 *  to x + 1.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#round
 */
declare function round(input: number): number;
/**
 * Get the sign of a number
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#sign
 */
declare function sign(input: number): number;
/**
 * The sine function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#sin
 */
declare function sin(input: number): number;
/**
 * The hyperbolic sine function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#sinh
 */
declare function sinh(input: number): number;
/**
 * The square root function.
 *
 *
 *  Note that this function is a holdover from before JS
 *  had the `**` operator for performing this calculation
 *  by using `x ** 0.5`.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#sqrt
 */
declare function sqrt(input: number): number;
/**
 * The tangent function
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#tan
 */
declare function tan(input: number): number;
/**
 * The hyperbolic tangent function
 *
 *  See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#tanh
 */
declare function tanh(input: number): number;
/**
 * Truncate a fraction to an integer by simply dropping the fractional part.
 *  Note that this differs from the `floor` function:
 *
 *  ```
 *  floor(4.2);  // 4
 *  floor(-4.2); // -5
 *
 *  trunc(4.2);  // 4
 *  trunc(-4.2); // -4
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#trunc
 */
declare function trunc(input: number): number;
/**
 * Get the binomial coefficient (n choose k).
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#binomial
 */
declare function binomial(n: number, k: number): number;
/**
 * Constrain a number to within a given range.
 *  This is really nothing more than a convenient
 *  function wrapper around the statement:
 *
 *  ```
 *  v < s ? s : v > e ? e : v
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#constrain
 */
declare function constrain(
  value: number,
  lowerBound: number,
  upperBound: number,
): number;
/**
 * The cosecant function, which is:
 *
 *  ```
 *  1 / sin(v)
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#csc
 */
declare function csc(value: number): number;
/**
 * The cotangent function, which is:
 *
 *  ```
 *  cos(v) / sin(v)
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#ctn
 */
declare function ctn(value: number): number;
/**
 * Convert a number in radians to a number in degrees.
 *  This is really nothing more than a convenient
 *  function wrapper around the statement:
 *
 *  ```
 *  v/PI * 180
 *  ```
 *
 *  With one trick, in that it allows you to constrain the
 *  resultant value to the standard [0, 360] interval.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#degrees
 */
declare function degrees(value: number, constrain?: boolean): number;
/**
 * Calculate the 2D Euclidean distance between two points.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#dist
 */
declare function dist(x1: number, y1: number, x2: number, y2: number): number;
declare function dist(p1: PointLike, p2: PointLike): number;
/**
 * Performs a line/line intersection test give either four points
 *  defining the lines (p1--p2) and (p3--p4), or eight coordinates
 *  spanning lines (x1,y1)--(x2,y2) and (x3,y3)--(x4,y4).
 *
 *  This function covers both "line/line" and "segment"/"segment"
 *  testing by setting a boolean value `inBounds` on the result:
 *  when false, there is only a line/line intersection, but when
 *  true, the actual line segments intersect.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#lli
 */
declare function lli(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): PointLike | false;
declare function lli(
  p1: PointLine,
  p2: PointLine,
  p3: PointLine,
  p4: PointLine,
): PointLike | false;
/**
 * Map a value from one interval to another, optionally
 *  constrained to the target interval.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#map
 */
declare function map(
  value: number,
  originalStart: number,
  originalEnd: number,
  newStart: number,
  newEnd: number,
  constrain?: boolean,
): number;
/**
 * Convert a number in degrees to a number in radians.
 *  This is really nothing more than a convenient
 *  function wrapper around the statement:
 *
 *  ```
 *  v/180 * PI
 *  ```
 *
 *  With one trick, in that it allows you to constrain the
 *  resultant value to the standard [0, TAU] interval.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#radians
 */
declare function radians(value: number, constrain?: boolean): number;
/**
 * Generate a pseudo-random number.
 *
 *  This is based on the SplitMix32 algorithm, covered
 *  over on https://stackoverflow.com/a/47593316/740553
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#random
 */
declare function random(): number;
declare function random(a: number): number;
declare function random(a: number, b: number): number;
/**
 * Set the pseudo-random number generator seed. If no seed
 *  value is provided, this is equivalent to calling:
 *
 *  ```
 *  randomSeed(Date.now() * Math.random())
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#randomSeed
 */
declare function randomSeed(seed?: number): void;
/**
 * The secant function, which is:
 *
 *  ```
 *  1 / cos(v)
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#sec
 */
declare function sec(value: number): number;
/**
 * Invert a matrix, or undefined if the matrix is not invertible.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#invertMatrix
 */
declare function invertMatrix(M: Matrix): number[][];
/**
 * Multiply two matrices
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#multiplyMatrix
 */
declare function multiplyMatrix(m1: Matrix, m2: Matrix): number[][];
/**
 * Transpose a matrix
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#transposeMatrix
 */
declare function transposeMatrix(M: Matrix): number[][];
/**
 * Set up a 3D to 2D projector. This can be either a CABINET
 *  or HOMOGENEOUS projector, supporting the following API:
 *
 *  - `setRotation(x, y, z)`
 *  - `setTranslation(tx, ty, tz)`
 *  - `setScale(tx, ty, tz)`
 *
 *  furthermore, the CABINET projector supports setting the
 *  default cabinet angle using:
 *
 *  - `setPhi(phi)`
 *
 *  and the HOMOGENEOUS projection supports setting the distance
 *  of the point-at-infinity by using:
 *
 *  - `setInfinity(distance)` (note, `distance` can be `Infinity`)
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setProjector
 */
declare function setProjector(falsey: implied): false;
declare function setProjector(
  projectorType: Symbol,
  projector: Projector,
): Projector;
/**
 * Unset the 3D projector, if one is currently active. This is
 *  equivalent to calling `setProjector(false)`, and will turn
 *  off projection **and** unbind the current projector. This
 *  can be useful, but most of the time you'll want to use the
 *  <a href="#useProjection">useProjection</a> and <a href="#noProjection">noProjection</a> functions instead.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noProjector
 */
declare function noProjector(): void;
/**
 * Enable a currently disabled 3D projector, allowing  you to
 *  mix projective 3D and regular 2D with relatively little effort.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#useProjection
 */
declare function useProjection(): void;
/**
 * (Temporarily) disable the 3D projector without unbinding it,
 *  allowing  you to mix projective 3D and regular 2D with relatively
 *  little effort.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#noProjection
 */
declare function noProjection(): void;
/**
 * Project a 3D "world" coordinate to a 2D "screen" coordinate.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#project
 */
declare function project(x: number, y: number, z: number): PointLike;
declare function project(p: PointLike): PointLike;
/**
 * Set the projector's x, y, and z axes of rotation in radians.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#rotateProjector
 */
declare function rotateProjector(x: number, y: number, z: number): void;
/**
 * Set the projector's x, y, and z coordinate offsets. Note that
 *  this value does *not* reset across successive draw calls. To
 *  reset the translation, you must issue `translateProjector(0,0,0)`.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#scaleProjector
 */
declare function scaleProjector(s: number): void;
declare function scaleProjector(x: number, y: number, z: number): void;
/**
 * Set the projector's x, y, and z coordinate offsets. Note that
 *  this value does *not* reset across successive draw calls. To
 *  reset the translation, you must issue `translateProjector(0,0,0)`.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#translateProjector
 */
declare function translateProjector(x: number, y: number, z: number): void;
/**
 * Set a border around the canvas.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setBorder
 */
declare function setBorder(width?: number | boolean, color?: string): void;
/**
 * Set the current stroke and fill colour at
 *  the same time.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setColor
 */
declare function setColor(color: string): void;
/**
 * Change the cursor to a specific icon:
 *
 *  - AUTO - use whatever the browser would otherwise use
 *  - CROSS - use a cross-hair icon
 *  - POINTER - use the "pointer" icon that is also used for clickable links
 *
 *  Use any other string found over on the MDN cursor article to set a cursor not covered by the above constants.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setCursor
 */
declare function setCursor(type: string): void;
/**
 * Set the current fill colour.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setFill
 */
declare function setFill(color: string): void;
/**
 * Set the current font using a single string. For the syntax,
 *  see https://developer.mozilla.org/en-US/docs/Web/CSS/font
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setFont
 */
declare function setFont(font: string): void;
/**
 * Set the current font family.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setFontFamily
 */
declare function setFontFamily(name: string): void;
/**
 * Set the current font size
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setFontSize
 */
declare function setFontSize(px: number): void;
/**
 * Set the current font weight
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setFontWeight
 */
declare function setFontWeight(val: number | string): void;
/**
 * Set the background grid spacing and colour.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setGrid
 */
declare function setGrid(spacing?: number, color?: string): void;
/**
 * Set the color that should be used to replace whatever
 *  highlight() marked as the "to highlight" color.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setHighlightColor
 */
declare function setHighlightColor(color: string): void;
/**
 * Set the line dash property. See the following MDN article for the details:
 *
 *  https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setLineDash
 */
declare function setLineDash(...values: number[]): void;
/**
 * Set the line width in pixels.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setLineWidth
 */
declare function setLineWidth(width?: number): void;
/**
 * Set the current stroke colour.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setStroke
 */
declare function setStroke(color: string): void;
/**
 * Set the current text alignment values.
 *
 *  Valid `xAlign` values are:
 *
 *  - CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 *  - END - the text anchor is on the right for LTR text, and on the left for RTL text.
 *  - LEFT - the text anchor is on the left side of the text. all text is to the right.
 *  - RIGHT - the text anchor is on the right side of the text. All text is to the left.
 *  - START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 *  Valid `yAlign` values are:
 *
 *  - ALPHABETIC - standard text alignment (default)
 *  - BOTTOM - the text is aligned to the bottom of the bounding box
 *  - HANGING - relevant for Tibetan and other Indic scripts.
 *  - IDEOGRAPHIC - relevant for ideographic CJKV text.
 *  - MIDDLE - The vertical equivalent of "center".
 *  - TOP - The text is aligned to the top of the typographic "em square".
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setTextAlign
 */
declare function setTextAlign(xAlign: string, yAlign: string): void;
/**
 * Set the text outline stroking properties.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#setTextStroke
 */
declare function setTextStroke(color: string, width?: number): void;
/**
 * Start a new shape. This yields a `Shape` object with the following API:
 *
 *  - `makeMovable(movable?: boolean)` - allow this shape to be moved around with the pointer (`movable` is true if omitted)
 *  - `allowResizing(allowed?: boolean)` - allow the points that make up this shape to be moved around (`allowed` is true if omitted)
 *  - `showPoints(showPoints?: boolean)` - determines whether or not to draw the pathing points on top of the shape during draw().
 *  - `close()` - close the current segment so no new points can be added.
 *  - `newSegment(closeExisting?: boolean)` - start a new segment in this shape, closing the previous segment if `closeExisting` is true (default=false)
 *
 *  A Shape also supports the following utility functions:
 *
 *  - `offset(x, y)` - (temporarily) move this shape by (x,y)
 *  - `commit()` - commit the temporary offset by rewriting all coordinates.
 *  - `reset()` - reset the shape to having no offset.
 *  - `draw()` - draws the shape using its current stroke, fill, and "show points" settings.
 *  - `inside(x, y): boolean` - returns whether or not a point lies inside this (implicitly closed) shape.
 *
 *  And it supports the following pathing functions, with arguments that
 *  can either consist of (the necessary number of) pairs of coordinate
 *  values, or (the necessary number of) point-likes, being objects with
 *  an `x` and `y` property.
 *
 *  - `moveTo(x,y OR p:pointLike)` - start a new segment and mark its path as starting at (x,y).
 *  - `lineTo(x,y,... OR p,...)` - add one or more points that connect to the previous point with a straight line.
 *  - `quadTo(cx,cy,x,y,... OR cp,p,...)` - add one or more quadratic bezier curves, where (cx,cy)/cp is the control point, and (x,y)/p the end point.
 *  - `curveTo(cx1,cy1,cx2,cy2,x,y,... OR c1p,c2p,p,...)` - add one or more cubic bezier curves, which have two control points.
 *  - `splineTo(x1,y1,... OR p1,...)` - add one or more cardinal spline pathing coordinates.
 *
 *  Cardinal spline coordinates are rendered by treating the path as closed
 *  (even if it is not), performing wrap-around lookups as needed in order
 *  to draw "something sensible".
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#startShape
 */
declare function startShape(): Shape;
/**
 * Clear the current shape, optionally closing it.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#endShape
 */
declare function endShape(close?: boolean): Shape;
/**
 * Start a new segment in a shape.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#newSegment
 */
declare function newSegment(close?: boolean): void;
/**
 * Centers the coordinate system on your graphic.
 *  This is equivalent to calling:
 *
 *  ```
 *  translate(width/2, height/2);
 *  ```
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#center
 */
declare function center(): void;
/**
 * Reset the coordinate transform matrix.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#resetTransform
 */
declare function resetTransform(): void;
/**
 * Rotate the coordinate system wrt the current origin.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#rotate
 */
declare function rotate(angle: number): void;
/**
 * Scale the coordinate system wrt the current origin.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#scale
 */
declare function scale(x: number, y?: number): void;
/**
 * Convert a screen (e.g. browser) coordinate into its
 *  corresponding "transformed" coordinate.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#screenToWorld
 */
declare function screenToWorld(x: number, y: number): PointLike;
declare function screenToWorld(p: PointLike): PointLike;
/**
 * Set the current transform matrix, based on applying:
 *
 *  ```
 *        | a b c |
 *    m = | d e f |
 *        | 0 0 1 |
 *  ```
 *
 *  With the parameters defaulting to the identity matrix.
 *
 *  See the following MDN article for more details about this function:
 *  https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/transform
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#transform
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
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#translate
 */
declare function translate(x: number, y: number): void;
declare function translate(p: PointLike): void;
/**
 * Convert an in-canvas "transformed" coordinate into its
 *  corresponding "screen" (i.e. browser canvas offset) coordinate.
 *
 * API docs: https://pomax.github.io/custom-graphics-element/api.html#worldToScreen
 */
declare function worldToScreen(x: number, y: number): PointLike;
declare function worldToScreen(p: PointLike): PointLike;
