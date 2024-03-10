# The `<graphics-element>` custom HTML element

<graphics-element title="A simple example graphic?" width="275" height="275" src="example.js" data-type="cubic"></graphics-element>

What if you could just put graphics on your web page, or in your web app, by just writing graphics JavaScript code and then using a &lt;graphics-element src="..."&gt; the same way you'd put regular JavaScript on a page using a &lt;script&gt; tag? As it turns out, that's not a "what if", it's something that the modern web supports, so if that's something you want, or need: maybe the &lt;graphics-element&gt; is for you!

The <a href="https://pomax.github.io/custom-graphics-element/">live site</a> shows off a bunch of things you might want to use this for, if you need inspiration, but keep reading if you want to to know how to use this element yourself, and what API it supports.

Also, if this made a difference in your dev life, consider (temporarily, even?) becoming a patron of my work over on https://www.patreon.com/bezierinfo, or send a one-time donatation to [help keep this project funded](https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=QPRDLNGDANJSW). Any amount is appreciated!

— [Pomax](https://mastodon.social/@TheRealPomax)

# Table of Contents

- [Writing graphics source code](#writing-graphics-source-code)
  - [Global variables](#global-variables)
  - [Slider-based variables](#slider-based-variables)
  - [Movable entities](#movable-entities)
  - [Pointer handling](#pointer-handling)
  - [Keyboard handling](#keyboard-handling)
  - [Linking guide text and graphics](#linking-guide-text-and-graphics)
  - [Spreading code over multiple source files](#spreading-code-over-multiple-source-files)
    - [Overloading "parent" functions](#overloading-parent-functions)
    - [Why use &lt;source&gt; to load code when JS imports exist?](#why-use-source-to-load-code-when-js-imports-exist)
- [The graphics API](#the-graphics-api)
  - [Maths](#maths)
  - [General globals](#general-globals)
  - [General functions](#general=functions)
  - [Drawing functions](#drawing-functions)
  - [3D functions](#3d-functions)
  - [Transformation functions](#transformation-functions)
  - [Setters](#setters)
  - [No... functions](#no-functions)

# Writing graphics source code

The &lt;graphics-element&gt; tag supports the following attributes:

- `title` - this is both the standard HTML title attribute, as well as the text that gets used as figure caption underneath your graphic. Omitting this will result in a warning on the console.
- `src` - this is the standard HTML attribute for indicating the source code for this element.
- `width` - the (unitless) width for your graphic. This value is optional, but your graphics code must use `setSize` if omitted.
- `height` - the (unitless) height for your graphic. This value is optional, but your graphics code must use `setSize` if omitted.
- `centered` - an optional "valueless" attribute that will center your graphic on the page.
- `float` - an optional attribute that takes values `left` or `right`, to float your graphic inside your other page content.

Additionally, a &lt;graphics-element&gt; is just a normal HTML tag, and allows child content. This means that if you wish to add guide text, that's as easy as just adding a paragraph:

```html
<graphics-element title="an example" src="..." width="400" height="200">
  <p>This guide text will render inside the graphics-element "box".</p>
</graphics-element>
```

Graphics source code uses standard JavaScript, with all graphics API functions available as globals. While the smallest source code is just an empty file, the recommended minimal code is:

```js
function setup() {
  setSize(123, 456);
}

function draw() {
  clear(`white`);
}
```

Both of these functions are technically optional, but omitting them doesn't make a lot of sense: by default the &lt;graphics-element&gt; will first run `setup`, and will then run `draw`, once. The `setSize(width, height)` call is optional as long as you've specified the `width` and `height` attributes on the `<graphics-element>` tag itself, but must be present if you decide to omit them (and note that `setSize()` can be called at any time to resize your graphic).

If you cannot link to a source code URL, you may also inline your code using a `<graphics-source>` element:

```html
<graphics-element title="an example" width="400" height="200">
  <graphics-source>
    function setup() { // ... } function draw() { // ... }
  </graphics-source>
</graphics-element>
```

Or you may inject it using a source code function if you're working purely in JS:

```javascript
const graphicsElement = document.createElement(`graphics-element`);

function sourceCode() {
  function setup() {
    setSize(300, 100);
  }

  function draw() {
    clear(`yellow`);
  }
}

// load the code once the custom element loader is done:
customElements.whenDefined(`graphics-element`).then(() => {
  graphicsElement.loadFromFunction(sourceCode);
});
```

In order to simplify certain aspects of graphics programming, several pieces of key functionality have been baked into the code runner:

## Global variables

Several globals exist to make your graphics life easier:

- `width` - the width of your graphic, in pixels.
- `height` - the height of your graphic, in pixels.
- `playing` - a boolean indicating whether this graphic is currently running in animated mode or not.
- `frame` - the current frame's number. Every time `draw` runs, this number will increase by 1.
- `frameDelta` - the time in milliseconds since the previous frame finished drawing.
- `pointer` - an object representing the mouse/stylus/touch input "cursor" (see below).
- `keyboard` - an object that tracks which keys are currently being pressed (see below).
- `currentPoint` - when using movable points, this will represent the movable point under the pointer, if there is one.

## Slider-based variables

You can automatically declare slider-controlled variables, which adds a slider to the on-page graphics element box, and automatically creates a global variable for your code to use. For example, to declare a variable `radius` that can range from 0 to 1, with slider steps of 0.001 and a starting value of 0.5, you would use:

```js
function setup() {
  addSlider(`radius`, { min: 0, max: 1, step: 0.001, value: 0.5 });
}
```

After this, the `radius` variable will be globally available, so that this code will "just work":

```js
function draw() {
  circle(width / 2, height / 2, radius);
}
```

For convenience, any variable that ends in a number will have that number shown using subscript styling, so a slider for `t1` will show "t<sub>1</sub>" rather than "t1" as its slider label, and any variable with `_` in it will subscript the part after the underscore, so that `k_p` becomes "k<sub>p</sub>" rather than "kp". Because your code doesn't care, but your users do, and subscripted variables are much nicer to look at.

## Adding buttons

Sometimes you want buttons to do things that you _could_ do with click handlers, but would be much nicer with a normal button. In those cases, you can use the `addButton` function:

```js
let p;

function setup() {
  addButton(`play`, (btn) => {
    btn.textContent = togglePlay() ? `pause` : `play`;
  });
  p = new Point(width / 2, height / 2);
}

function draw() {
  clear();
  setColor(`black`);
  point(p.x, p.y);
  p.x += random(-2, 2);
  p.y += random(-2, 2);
}
```

## Movable entities

Rather than having to write your own click-drag logic, you can mark things as "movable" by calling `setMovable(...)`. This can either be `Point` instances or an array of `Point` instances. After marking them as movable, the API does the rest. When the pointer is over movable points it will update the global `currentPoint` value and change to the typically pointing finger icon, with click-dragging (or touch-dragging) automatically updating your point's coordinates.

```js
const p;

function setup() {
  setSize(400, 400);
  p = new Point(200, 200);
  setMovable(p);
}

function draw() {
  clear(`#eee`);
  setColor(`#444`);
  point(p.x, p.y);
}
```

That's all the code we need: users can now click/tap/touch-drag our point around.

## Pointer handling

Graphics interaction is based on "the pointer", which is a unified handler for mouse, stylus, and touch handling, so you don't have to care whether your code runs on a desktop computer, a laptop, a tablet, a phone, or anything else. Event handling uses five functions:

```js
function pointerActive(trueOrFalse) {
  // the pointer either entered or left the canvas region.
}

function pointerDown(x, y) {
  // a mouse down, stylus down, or touch start at graphics coordinate x/y (not screen coordinate).
}

function pointerUp(x, y) {
  // a mouse up, stylus up, or touch end at graphics coordinate x/y.
}

function pointerClick(x, y) {
  // a shorthand function for a pointerdown followed by a pointerup on the same x/y coordinate
}

function pointerMove(x, y) {
  // a mouse move/drag, stylus move/drag, or touch move/drag at graphics coordinate x/y.
}

function pointerDrag(x, y) {
  // a shorthand function for a pointer move at some time after a pointer down, but before pointer up.
}
```

In addition to this, there is the global `pointer` object that can be consulted in any of your code, with the following properties:

- `active` - true/false based on whether or not the pointer is currently on/over the canvas.
- `x` - the current graphics x coordinate for the pointer
- `y` - the current graphics y coordinate for the pointer
- `down` - true/false based on whether the pointer is currently down or not.
- `mark` - when the pointer is down, this is an object `{x, y}` representing where the pointer down event happened.
- `drag` - whether we're currently dragging the pointer.

## Keyboard handling

When focus is on the &lt;graphics-element&gt;, keyboard input will be sent into your graphics code, using the following functions:

```js
function keyDown(key, shift, alt, ctrl, meta) {
  // the "key" value is the key name being pressed, shift, alt, ctrl, and meta are boolean flags
}

function keyUp(key, shift, alt, ctrl, meta) {
  // as above
}
```

Note that there is no "key typed" handler, you get to decide whether down or up counts as "typing". There is a global `keyboard` object that tracks which keys are down: if a key is down, it will have a corresponding `keyboard[keyName]` entry, with its value being the `Date.now()` timestamp when the key got pressed. Once the key is released, its entry gets removed from `keyboard` (not just set to a falsey value).

## Linking guide text and graphics

The graphics element supports automatic highlighting of parts of your graphic by using color tags. For example, the following graphics code:

```js
function draw() {
  setColor(`red`);
  line(0, 0, width, height);
  text(`the center of the universe`, width / 2, height / 2);
}
```

can be combined with guide text that includes a highlighting tag for the corresponding color:

```html
<graphics-element title="..." src="...">
  <p>Let's highlight <red>the universe</red>!</p>
</graphics-element>
```

Now, whenever a user places their pointer (mouse, stylus, or touch) on that marked-up text, the corresponding color will get highlighted in the graphic. All [named CSS colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) are supported for this purpose.

## Spreading code over multiple source files

The &lt;graphics-element&gt; element allows you to specify _multiple_ source files, with one "main "file indicated using the `src="..."` attribute, and additional sources through the use of the `<source>` element:

```html
<p>Let's look at the base case:</p>

<graphics-element
  title="multiple sources"
  src="./base-code.js"
></graphics-element>

<p>We can extend this by using the standard approach:</p>

<graphics-element title="established convention" src="./base-code.js">
  <source src="variation-01.js" />
</graphics-element>

<p>But there's a more interesting way to tackle this:</p>

<graphics-element title="a creative variation" src="./base-code.js">
  <source src="variation-02.js" />
</graphics-element>
```

This will create a single source file, but allows you to split up your code in a way that lets you reuse the same code across multiple graphics elements with only the differences stored in each extra source file.

### Overloading "parent" functions

Your additional sources **may contain additional setup() and draw() functions**, which will be run at the end of the main `setup()` and `draw()` functions, in the same order of your `<source>` elements.

You cannot use this to "redeclare" any other function, though: if the main source file contains `function test() { ... }` and your additional source file also specifies `function test() { ... }`, then you'll see an error in your Developer Tools "console" tab along the lines of:

```
Uncaught (in promise) SyntaxError: redeclaration of function test
note: Previously declared at line 123, column 45
```

### Why use &lt;source&gt; to load code when JS imports exist?

The way additional sources are included _fundamentally_ differs from the standard module import mechanism: JS imports are loaded in their own, isolated, scope and _**will not**_ have access to any of the graphics functions and constants, whereas code loaded through a `<source>` element effectively gets packed up as a single bundle with the "main" graphics source code and so _**will**_ have access to all the graphics API functions.

As such, if you need pure JS code imported, use an `import` statement in your source code, but if you need something like a class that knows how to draw itself by calling graphics API functions, you can load that same code as a `<source>` and things will work just fine.

As example, pure utility code that doesn't do any sort of drawing should always be imported:

```js
class PID {
  constructor(p, i, d, ...) {
    this.kp = p;
    this.ki = i;
    this.kd = d;
    ...
  }

  getRecommendation(current, target) {
    const error = target - current;
    const P = (kp * error) / dt;
    const I = ...
    // ...
    return P + I + D;
  }
}
```

Nothing in the above code has anything to do with drawing things, and is pure JS utility code. As such, we can simply import it directly:

```js
import { PID } from "./pid.js";

let pid;

function setup() {
  pid = new PID(1, 0, 0);
}

// ...
```

However, the following kind of code should be a `<source>` inclusion:

```js
class Airplane extends Circle {
  heading = 0;

  constructor(x, y, heading) {
    super(x, y, 100);
    this.heading = heading;
  }

  draw() {
    save();
    translate(this.x, this.y);
    rotate(this.heading);
    line(0, 0, 20, 0);
    restore();
  }
}
```

This code heavily relies on the graphics API, and so trying to `import` it will throw errors at runtime.

# The graphics API

The remainder of this document is the API documentation for all functions and constants that are available for writing cool graphics code with.

## Maths

For convenience, (almost) all the `Math` properties are available as globals. Rather than list all of them, the ones you _don't_ get are:

- the `LN2`, `LN10`, `LOG2E`, `LOG10E`, `SQRT1_2`, and `SQRT_2` values. You will never write code where having these derivative constants rather than using `ln(2)`, `ln(10)`, `log2(E)`, `log(E)`, `1**0.5` and `2**0.5` make the difference between a responsive, performant graphics element, and something unusable.
- the `log1p` function: just use `ln(1+...)`, you don't need a separate function for this.

Also, because JS got some things wrong, the natural logarithm is `ln()`, and the base-10 logarithm is `log()`.

Some missing functions have also been added:

- `constrain(v, s, e)` constrains a value `v` to the interval `[s, e]`.
- `degrees(v, constrained=false)` - convert a value in radians to degrees. If `constrained` is set to the constant `CONSTRAIN`, the result will be constrained to between 0 and 360.
- `dist(x1, y1, x2, y2)` - the euclidean distance between two points.
- `csc(v)` - the cosecant function
- `ctn(v)` - the cotangent function
- ` map (v, s, e, ns, ne, constrained=false)` maps a value `v` from interval `[s,e]` to interval `[ns,ne]` instead. If `constrained` is set to the constant `CONSTRAIN`, the result will be constrained to `[ns,ne]`.
- `radians(v, constrained=false)` - convert a value in degrees to radians. If `constrained` is set to the constant `CONSTRAIN`, the result will be constrained to between 0 and TAU.
- `random(a, b)` - get a random value between `a` (inclusive) and `b` (exclusive). If `b` is omitted, this generates a random value between `0` and `a`, instead.
- `sec(v)` - the secant function

And some missing constants have been added:

- `epsilon` - the smallest positive non-zero value permitted in JavaScript.
- `huge` - the &lt;canvas&gt; equivalent of `Infinity`, as `line(-Infinity,0,Infinity,0)` will not work, but `line(-huge,0,huge,0)` will.
- `TAU` - equal to 2π, because you constantly need this value when doing graphics programming.

## General globals

The following variables are available:

- `width` - the width of your graphic, in pixels.
- `height` - the height of your graphic, in pixels.
- `playing` - a boolean indicating whether this graphic is currently running in animated mode or not.
- `frame` - the current frame's number. Every time `draw` runs, this number will increase by 1.
- `frameDelta` - the time in milliseconds since the previous frame finished drawing.
- `pointer` - an object representing the mouse/stylus/touch input "cursor".
- `keyboard` - an object that tracks which keys are currently being pressed.
- `currentPoint` - when using movable points, this will represent the movable point under the pointer, if there is one.

The following constants are available:

- `AUTO`
- `ALPHABETIC` - used in vertical text alignment
- `BOTTOM`
- `BOTTOM_LEFT`
- `BOTTOM_RIGHT`
- `CENTER`
- `CONSTRAIN` - used for the `constrain()` function
- `CROSS` - used for changing the cursor
- `END`
- `HANGING` - used in vertical text alignment
- `IDEOGRAPHIC` - used in vertical text alignment
- `LEFT`
- `LTR` - used for indicating text direction
- `MIDDLE`
- `POINTER` - used for changing the cursor
- `RIGHT`
- `RTL` - used for indicating text direction
- `START`
- `TOP`
- `TOP_LEFT`
- `TOP_RIGHT`

## General functions

- `addButton(label, clickHandler)` - adds a button to the graphics element, below the graphic pane, with the provided label, calling `clickHandler(button)` every time the button is clicked. This function returns the `<button>`.

- `addSlider(varName, options = {})` - adds a numerical range slider to the graphics element, below the graphic pane, automatically binding a global variable with the indicated name (this value as function argument must be a string). This function returns the range slider `<input>`. Valid options are:

  - `min` - the minimum number, defaults to 0
  - `max` - the maximum number, defaults to 1
  - `step` - the step size, defaults to (max - min) / 10.
  - `value` - the initial value, defaults to (max - min) / 2.
  - `transform` - a value transformer that can be used to turn "the slider's value" into a different "variable assignment value". this must be a function of the form `value => <number>`.

- `clearMovable()` - clears the list of movables, effectively disabling automatical click-dragging of things until you mark something as movable again.

- `copy()` - gets a copy of the canvas in its current state for either use by other page code, or for use as the equivalent of an image in your own code.

- `color(h=current heu, s=50, l=50, a=1)` - turn an HSLA coordinate into a canvas color. All arguments are optional, with `h` defaulting to "whatever the current internal hue value is" (starting at 0, and potentially changed by repeated calls to `randomColor`).

- `find(qs)` - equivalent to querySelector(qs), scoped to the graphics element itself.

- `findAll(qs)` - equivalent to querySelectorAll(qs), scoped to the graphics element itself.

- `highlight(color)` - This activates the "current highlight color" when using `color` as argument for `setColor`, `setFill`, and `setStroke` (the current highlight color can be changed using `setHighlightColor`). Use `false` as color to disable highlighting.

- `millis()` -The number of milliseconds that have passed since this graphics element started running.

- `pause()` - If the graphics element is running in animated mode, this will pause the animation.

- `play()` - If the graphics element is not running in animated mode, this will start running it in animated mode.

- `randomColor(a = 1.0, cycle = true)` - generate a random canvas color, optionally with explicit alpha value, and optionally with an instruction to either cycle the internal "current hue" value.

- `setMovable(points)` - Mark one or more points as movable (see the section on movable entities above).

- `setSize(width, height)` - set the graphics pane dimensions. If a graphics element does not specify `width` or `height` as attributes, you'l want this to be your first instruction in `setup()`, but it can be (re)issued at any point during the life cycle of your graphics to resize it. (Note that this does not scale your graphics, it _only_ sets the dimensions of the graphics pane).

- `restore()` - restores a previously saved graphics context.

- `save()` - save the current graphics context. Use this in conjunction with `restore()` to effectively take a "snapshot" of the current transformation and styles, so you can change them to whatever they temporarily need to be, before calling `restore()` to get back to what they were at the time of your snapshot.

- `toDataURL()` - turn the current graphic into a data-URL representing a PNG image

- `togglePlay()` - either run `pause()` or `play()`, depending on whether the graphics element is running in animated mode or not. This returns the current play state as boolean.

## Drawing functions

- `arc(x, y, r, s = 0, e = TAU, wedge = false)` - draw an arc centered on x/y, with radius `r`, start angle `s`, end angle `e`, and if the optional parameter `wedge` is true, draw the arc as a wedge instead.

- `axes(hLabel, hs, he, vLabel, vs,ve, hsLabel = false, heLabel = false, vsLabel = false, veLabel = false)` Draw a set of labeled axes, where:

  - `hLabel` - is the text label for the horizontal axis
  - `hs` - is the graphics x coordinate for the start of the axis
  - `he` - is the graphics x coordinate for the end of the axis
  - `vLabel` - is the text label for the vertical axis
  - `vs` - is the graphics y coordinate for the start of the axis
  - `ve` - is the graphics y coordinate for the end of the axis
  - `hsLabel` - is a text label, placed at `hs`. If no label is specified, the value `hs` is used instead.
  - `heLabel` - is a text label, placed at `he`. If no label is specified, the value `he` is used instead.
  - `vsLabel` - is a text label, placed at `vs`. If no label is specified, the value `vs` is used instead.
  - `veLabel` - is a text label, placed at `ve`. If no label is specified, the value `ve` is used instead.

- `bezier(points)` - draw one or more connected cubic bezier curves. If `points` has length 4, one curve is drawn, if it has length `4+3n`, `n+1` curves will be draw, where each subsequent curve's starting point is the previous curve's end point.

- `bspline(points, open=true)` - draw a B-spline that either starts and end at the first and last point, or doesn't, based on whether `open` is true or false. If omitted, `open` will be true and the spline will start and end at the first and last point.

- `circle(x, y, r)` - draw a circle at x/y with radius `r`

- `clear(color = `white`)` - clear everything, setting the background to a specific color, or `white` if omitted.

- `end(close = false)` - finalise a shape that you started drawing with `start()`.

- `grid()` - draw a line grid using the spacing and color specified by `setGrid()`.

- `async image(img, x = 0, y = 0, w, h)` - draw an image either directly using `Image` or `Canvas`, or from URL when `img` is a string, with the top-left corner at x/y, and either explicit width and height, or "whatever the image says" when omitted. Note that this is an asynchronous function since drawing images from URL requires making a network request, and so you are given the choice to either "trust it'll happen" (generally a bad plan) or `await` this function call's completion.

- `line(x1, y1, x2, y2)` - draw a line between two points.

- `plot(f, a = 0, b = 1, steps = 24, xscale = 1, yscale = 1)` - plot a function `y = f(x)` starting at `x=a`, ending at `x=b`, using `steps` steps, drawing with the x values optionally scaled by `xscale` and the y values optionally scaled by `yscale`.

- `plotData(data, x, y)` - plot an array of data points, with the `x` and `y` values pulled from each data point as `point[x]` and `point[y]`. If a data point is an array, `x` and `y` should be numerical. If a data point is an object, `x` and `y` should be property name.

- `point(x, y)` - draw a single point. This is equivalent to calling `circle(x, y, 3)`.

- `rect(x, y, w, h)` - draw a rectangle with the top left corner at x/y and the indicate width and height.

- `spline(points, virtual = true, tightness = 1)` - draw a [cardinal spline](https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline) through a series of points. If `virtual` is true, "fake points" will be invented to ensure that the cardinal spline starts and ends at the first and last point in `points`. If `tightness` is specified, the spline will be pulled "tigher" or "looser" across the points, depending on whether the value is greater or less than 1.

- `start()` - start a path drawing operation, which will not complete until `end()` is called.

- `text(str, x, y, xalign, yalign)` - draw text with the text anchor at x/y, with optional x and y alignment,

- `triangle(x1, y1, x2, y2, x3, y3)` - draw a triangle defined by three points.

- `vertex(x, y)` - add a polygonal vertex to the current path. Only use this after calling `start()`.

## 3D functions

The graphics API does not support true 3D, but does support coordinate projection, based on an (extremely simple) cabinet projector. This project offers the following API functions:

- `project(x,y,z)` - returns the 2D projection of a 3D coordinate, in `[x, y]` form.
- `rotateProjector(x,y,z)` - set the projector's X, Y, and Z rotation. These will always be applied separately, but in order.
- `setProjector(ox, oy, scale, phi)` - configure the projector by setting its viewport offset x and y, a scaling factor, and the cabinet projection angle.

## Transformation functions

These functions manipulate the coordinate system, which can greatly simplify, or greatly complicate, drawing things.

- `resetTransform()` - reset the graphics transform matrix to its default values.

- `restore()` - restore a previously saved graphics context.

- `rotate(angle)` - rotate the coordinate system around whatever is currently (0,0) by the specified angle in radians.

- `save()` - save the current graphics context, including the transformations.

- `scale(x = 1, y = x)` - scale the coordinate system relative to whatever is currently (0,0) by the indicated x and y factor. If `y` is omitted, it'll scale both dimensions equally.

- `screenToWorld(x, y)` - convert a screen coordinate (based on the "actual" x/y pixel on your screen) to the corresponding x/y value after taking the current coordinate transformation into account.

- `transform(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0)` - apply a coordinate transform direction rather than by using `rotate`, `scale`, and `translate` separately.

- `translate(x = 0, y = 0)` - move the coordinate system horizontally by x and vertically by y.

- `worldToScreen(x, y)` - convert a world coordinate based on the current coordinate transformation to its corresponding "screen coordinate".

## Setters

There are a number of setting functions, some of which have corresponding "no..." functions (see the next section for those).

- `setBorder(width = 1, color = black)` - set the border around the actual graphics pane.

- `setColor(color)` - set both the current stroke and fill colors.

- `setCrisp(enabled = true)` - either enable to disable anti-aliassing, to force "the crispest" (but not necessarily best looking) lines.

- `setCursor(type)` - change the cursor to a specific icon:

  - `AUTO` - use whatever the browser would otherwise use
  - `CROSS` - use a cross-hair icon
  - `POINTER` - use the "pointer" icon that is also used for clickable links
  - use any other string found over on [the MDN cursor article](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) to set a cursor not covered by the above constants.

- `setFill(color = black)` - Set the fill color to use until we change it. This is used both by "filled shapes" such as circles and triangles, as well as text (which is considered outline graphics to be filled with a color).

- `setFont(font)` - set all aspects of the font to use for drawing text, using the CSS format for a combined font instruction.

- `setFontFamily(name)` - set the current font family.

- `setFontSize(size)` - set the current font size, with the size treated as number of pixels.

- `setFontWeight(weight)` -set the current font weight, use a CSS weight number value.

- `setGrid(spacing = 20, color = lightgrey)` - set the grid spacing and color to use when `grid()` is used.

- `setHighlightColor(color)` - set the color that should be used as highlighting color.

- `setLineDash(...values)` - set the [line dashing parameter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash).

- `setLineWidth(width = 1)` - set the "brush width" that is used for all stroking operations, in pixels.

- `setStroke(color = black)` - Set the stroke color to use until we change it.

- `setTextAlign(xalign, yalign = ALPHABETIC)` - set the horizontal and vertical align values to be used for drawing text, until we change it. If omitted, the vertical align will use "standard text alignment". Possible values are:

  - xalign=`CENTER` - the text anchor is in the middle of the text. Text is placed evenly on either side.
  - xalign=`END` - the text anchor is on the right for LTR text, and on the left for RTL text.
  - xalign=`LEFT` - the text anchor is on the left side of the text. all text is to the right.
  - xalign=`RIGHT` - the text anchor is on the right side of the text. All text is to the left.
  - xalign=`START` - the text anchor is on the left for LTR text, and on the right for RTL text.

  and

  - yalign=`ALPHABETIC` - standard text alignment
  - yalign=`BOTTOM` - the text is aligned to the bottom of the bounding box
  - yalign=`HANGING` - relevant for Tibetan and other Indic scripts.
  - yalign=`IDEOGRAPHIC` - relevant for ideographic CJKV text.
  - yalign=`MIDDLE` - The vertical equivalent of "center".
  - yalign=`TOP` - The text is aligned to the top of the typographic "em square".

- `setTextDirection(dir = inherit)` - set the text direction to either `LTR` for left-to-write text, `RTL` for right-to-left text, or `inherit` for "whatever the context this &lt;graphics-element&gt; is used in is".

- `setTextStroke(color, width)` - set the text stroke color and thickness (this only affects the "outline path" stroke for text, not the fill color).

## No... functions

These are the counterparts to (many of) the above setters.

- `noBorder()` - turn off the border around the graphics pane.

- `noColor()` - combined `noFill()` and `noStroke()`.

- `noCursor()` - Turn off the cursor entirely. Note that this _turns off the cursor_ it does not set it to "whatever the page thinks it should be"!

- `noFill()` - Don't color in any otherwise filled shapes.

- `noGrid()` - Don't automatically draw a grid as part of the draw cycle. Note that this does not "disable" the `grid()` function, it only turns off the automatic drawing of a grid that normally happens as part of the `draw()` call.

- `noLineDash()` - Use solid strokes.

- `noStroke()` - Don't draw (out)lines.

- `noTextStroke()` - Disable text stroke around text.
