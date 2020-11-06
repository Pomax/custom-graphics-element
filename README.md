<script type="module" src="https://pomax.github.io/custom-graphics-element/graphics-element/graphics-element.js"></script>
<link rel="stylesheet" href="https://pomax.github.io/custom-graphics-element/graphics-element/graphics-element.css">
<link rel="stylesheet" href="style.css">

# The `<graphics-element>` custom HTML element

<graphics-element title="A simple example graphic?" width="275" height="275" src="example.js"></graphics-element>

What if you could just write graphics sketches on the web, similar to the old Processing.js (a JS port of [Processing](https://processing.org), the visual programming language, that was archived back in December of 2018), directly writing your graphics code as part of your HTML (similar to including an inline script), or by linking to a "main" source file by using a `src` attribute on an HTML element (similar to including a script the normal modern way)?

Thanks to JS having kicked into higher gear since 2015 when it comes to features, and the web APIs having gotten much richer, this is now entirely possible... so if that's something you want to use on your webpages: maybe the `<graphics-element>` element is for you!

## Table of Contents

**About the `<graphics-element>`**

- [Introduction](#introduction)
- [how to make this work on your own site](#how-to-make-this-work-on-own-site)
- [the `<graphics-element>` element](#the-graphics-element-element)
  - [Specifying code directly](#specifying-code-directly)
  - [Specifying code using the `<program-code>` element](#specifying-code-using-the-program-code-element)
  - [Specifying code using the `src` attribute](#specifying-code-using-the-src-attribute)
- [the `<program-code>` element](#the-program-code-element)
- [the `<fallback-image>` element](#the-fallback-image-element)

**Writing graphics code**

- [The basics](#the-basics)
- [User-initiated events](#user-initiated-events)
  - [touch/mouse events](#touch-mouse-events)
  - [keyboard events](#keyboard-events)
- [Controllable parameters](#controllable-parameters)
  - [Using fixed startup parameters](#using-fixed-startup-parameters)
  - [Using dynamic value sliders](#using-dynamic-value-sliders)
    - [in code](#in-code)
    - [from HTML](#from-html)
- [Movable points](#movable-points)

**API Documentation**

- [Global constants](#global-constants)
- [Instance properties](#instance-properties)
- [General functions](#general-functions)
- [Maths functions](#maths-functions)
- [Property functions](#property-functions)
- [Coordinate transform function](#coordinate-transform-function)
- [Drawing functions](#drawing-functions)
- [Shape drawing functions](#shape-drawing-functions)
- Built-in Object types
  - [Shape](#shape)
  - [Vector](#vector)
  - [Matrix](#matrix)
  - [Bezier](#bezier)
  - [BSpline](#bspline)

---


## Introduction

### How to make this work on your own site

[Download the graphics-element packages](https://github.com/Pomax/custom-graphics-element/archive/master.zip) and copy the `graphics-element` dir into whatever you keep your page/site's javascript files. Then simply have the following `<script>` tag in your HTML:

```html
<script type="module" src="/.../graphics-element/graphics-element.js" async></script>
```

You can put this anywhere in your HTML because of that [async](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async) attribute, but the normal spot would be somewhere inside your `<head>` section.

Additionally, there is a convenience stylesheet that you can load so you don't have to write your own "what to show when the graphics-element is not quite yet defined, when to hide the fallback-image, etc.":

```html
<link rel="stylesheet" href="/.../graphics-element/graphics-element.css" async></script>
```


### The `<graphics-element>` element

The `<graphics-element>` element is similar to the `<img>` element, having the following HTML syntax:

```html
<graphics-element title="..." width="..." height="..." src="...">
  ...
</graphics-element>
```

In addition to the standard attributes, there are also two attributes that you won't need unless you care about localizing your content (which, hopefully, you do!):

```html
<graphics-element title="..." width="..." height="..." src="..." viewSource="コードを読む" reset="リセット">
  ...
</graphics-element>
```

This is typically useful if you generate your HTML using a locale-aware templating language, e.g.:

```html
<graphics-element ... viewSource={{ 'view source' | localize }}" reset="{{ 'reset' | localize }}">
  ...
</graphics-element>
```

#### Specifying code directly

You can specify graphics code directly as content for the `<graphics-element>` if you just want to get straight to business:

```html
<graphics-element ...>
  let curve;

  setup() {
    curve = Bezier.create(this, 0,0, 100,100, 200,0);
    setMovable(curve.points);
  }

  draw() {
    clear(`white`)
    curve.drawCurve();
  }
</graphics-element>
```

#### Specifying code using the `<program-code>` element

You can also wrap your code in a `<program-code>` element, which you will have to do if you intend to put any other HTML inside your `<graphics-element>`.

```html
<graphics-element ...>
  <program-code>
    setup() {
      ...
    }

    ...
  </program-code>
</graphics-element>
```

#### Specifying code using the `src` attribute

Of course, the most "webbish" way to load code is to use the `src` attribute:

```html
<graphics-element ... src="./my-code.js"></graphics-element>
```

For convenience, code uses the `.js` extension, but the `<graphics-element>` technically doesn't care what extension you use. The only reason `.js` is recommended is because your code will get dropped into a modern JS class that `extends Example`, after which it gets run directly.


### The `<fallback-image>` element

One of the annoying things about the modern web is that a lot of content has to load on a page, with already rendered content moving around as the rest loads in. It is the worst. That's why you can also specify a fallback image that gets used not just when JS is disabled by your users (a very safe practice, if you're not using browser extensions that disable JS by default so you can whitelist what should be allowed to run, you probably want to install one) but also for as long as it takes the browser to load in the `<graphics-element>` definition.

```html
<graphics-element title="An interactive graphic element" width="400" height="200" src="example.js">
  <fallback-image>
    <img class="fallback" src="images/interactive.png" width="400" height="200">
    scripts are disabled, showing placeholder
  </fallback-image>
</graphics-element>
```

This allows the browser to "preallocate" the space required on the page for your graphic, while also having meaningful content on the page rather than just "an empty space".

## The basics

Graphics code is bootstrapped and drawn uses two "master" functions:

```js
setup() {
    // initialisation code goes here
}

draw() {
    // drawing code goes here
}
```

All code starts at `setup()`, automatically calling `draw()` after setup has been completed. Standard JS scoping applies, so any variable declared outside of `setup`/`draw` will be a "global" variable.

Note that neither of these functions are _required_: without a `setup()` function the code will just jump straight to `draw()`, and without a `draw()` function the code will simply not draw anything beyond the initial empty canvas.

## User-initiated events

### Touch/mouse events

Graphics code can react to touch/mouse, which can be handled using:

- `onMouseDown()` triggered by mouse/touch start events.
- `onMouseUp()` triggered by mouse/touch end events.
- `onMouseMove()` triggered by moving the mouse/your finger.

Mouse event data can be accessed via the `this.cursor` property, which encodes:

```
{
    x: current event's screen x coordinate
    y: current event's screen x coordinate
    down: boolean signifying whether the cursor is engaged or not
    mark: {x,y} coordinate object representing where mousedown occurred
    last: {x,y} coordinate object representing where the cursor was "one event ago"
    diff: {x,y} coordinate object representing the x/y difference between "now" and "one event ago",
          with an additional `total` propert that is an {x,y} coordinate object representing the x/y
          difference between "now" and the original mousedown event.
}
```

#### Example

```js
setup() {
    this.defaultBgColor = this.bgColor = `green`;
}

draw() {
    clear(this.bgColor);
}

onMouseDown() {
    this.bgColor = `blue`;
    redraw();
}

onMouseMove() {
    this.bgColor = `red`;
    redraw();
}

onMouseUp() {
    this.bgColor = this.defaultBgColor;
    redraw();
}
```

### Keyboard events

Graphics code can also react to keyboard events, although this is a great way to make sure your code won't work for mobile devices, so it's better to use range sliders to keep things accessible. That said, they can be handled using:

- `onKeyDown()` triggered by pressing a key
- `onKeyUp()` triggered by releasing a key

Keyboard event data can be accessed via the `this.keyboard` property, which encodes:

```
{
    currentKey: the name of the key associated with the current event
}
```

Additionally, the `this.keyboard` property can be consulted for named keys to see if they are currently down or not, e.g. to check whether the up arrow is down or not:

```js
draw() {
    if (this.keyboard[`w`] && this.keyboard[`d`]) {
        // move up-left
    }
}
```

#### Example

```js
setup() {
    this.y = this.height/2;
}

draw() {
    clear();
    setColor(`black`);
    rect(0, this.y-1, this.width, 3);
}

onKeyDown() {
    const key = this.keyboard.currentKey;
    if (key === `ArrowUp`) {
        y -= 5
    }
    if (key === `ArrowDown`) {
        y += 5;
    }
    y = constrain(y, 0, this.height);
    redraw();
}
```

## Controllable parameters

Graphics code can be provided with outside values in two different ways.

### Using fixed startup parameters

Graphics code can be passed fixed values from HTML using data attributes:

```html
<graphics-element src="..." data-propname="somevalue"></graphics-element>
```

which can be access on the code side using

```js
this.parameters.propname;
```

Note that `this.parameters` is a protected object. Properties of the parameters object can be updated by your code, but you cannot reassign `this.parameters` itself.


### Using dynamic value sliders

Graphics code has also be provided with dynamic values by using range sliders. There are two ways to do this: purely in code, or by tying the graphics code to HTML sliders.

#### In code

If sliders may be dynamically required, the `addSlider` function can be used:

```js
setup() {
    addSlider(`rangeValue`, 0, 1, 0.001, 0.5);
}

draw() {
    console.log(this.rangeValue);
}
```

Its function signature is `addSlider(property name, min, max, step, initial value)`, in which the arguments represent:

- `property name` a propertyname string that may start with `!`. If no `!` is used, the property name should follow the rules for variable names, as the property will be exposed as `this.propertyname` (e.g. is you use `rangeValue`, then `this.rangeValue` will exis and be kept up to date by the slider logic). If `!` is used, no `this.propertyname` will be be set up for use in your code. Regardless of whether `!` is used or not, the property name will also be displayed in the slider's UI.
- `min` the minimum numerical value this variable will be able to take on
- `max` the meximum numerical value this variable will be able to take on
- `step` the value increase/decrease per step of the slider.
- `initial value` the value that the associated variable will be assigned as part of the `addSlider` call.

#### From HTML

You can also "presupply" a graphic with sliders, if you know your graphic has a fixed number of dynamic variables. This uses the standard HTML `<input type="range">` element:

```html
<graphics-element src="..." data-propname="somevalue">
    <input type="range" min="0" max="1" step="0.001" value="0.5" class="my-slider">
</graphics-element>
```

With the graphic code using `setSlider` with a query selector to find your slider element and tie it to a variable:

```js
setup() {
    setSlider(`.my-slider`, `rangeValue`, 0.5);
}

draw() {
    console.log(this.rangeValue);
}
```

Its function signature is `setSlider(query selector, property name, initial value)`, in which the arguments represent:

- `query select` a CSS query selector for finding the right slider in your `<graphics-element>` tree. If you only have one slider then this query selector can simply be `input[type=range]`, but if you have multiple sliders it's a better idea to give each slider a CSS class that can be used to indentify it.
- `property name` a propertyname string that may start with `!`. If no `!` is used, the property name should follow the rules for variable names, as the property will be exposed as `this.propertyname` (e.g. is you use `rangeValue`, then `this.rangeValue` will exis and be kept up to date by the slider logic). If `!` is used, no `this.propertyname` will be be set up for use in your code. Regardless of whether `!` is used or not, the property name will also be displayed in the slider's UI.
- `initial value` the value that the associated variable will be assigned as part of the `addSlider` call.

Note that while it might seem that `<input>` elements can be made fully self-descriptive for both the property name (using the `name` attribute) and initial value (using the `value` attribute), this code still needs to do the right thing even in the absence of an HTML page, and so the property name and initial value are explicitly required.

**warning:** if you try to set up a slider for a property name that you have already defined, the code will throw a runtime error.


## Movable points

An important part of the Graphics API is showing shapes that are controlled or defined by coordinates, and so there are special functions for marking points as "movable" - that is, these points can be click/touch-dragged around a graphic. To fascilitate this, the following functions can be used:

- `setMovable(points, ...)` takes one or more arrays of points, and marks all points as "being movable", such that if the cursor activates at an x/y coordinate near one of these, that point gets assigned to `this.currentPoint`, as well as being automatically moved around as you drag the cursor around on the sketch.
- `resetMovable()` will clear the list of movable points.
- `resetMovable(points, ...)` is the same as calling `resetMovable()` followed by `setMovable(points, ...)`.


## The API

The following is the list of API functions that can be used to draw... whatever you like, really.

### Global constants

- `PI` 3.14159265358979
- `TAU` 6.28318530717958
- `POINTER` "default"
- `HAND` "pointer"
- `CROSS` "crosshair"
- `POLYGON` Shape.POLYGON, "Polygon"
- `CURVE` Shape.CURVE, "CatmullRom"
- `BEZIER` Shape.BEZIER, "Bezier"
- `CENTER` "center"
- `LEFT` "left"
- `RIGHT` "right"


### Instance properties

- `this.currentPoint` whatever point thec cursor is currently close enough to to interact with
- `this.currentShape` the currently active shape. **warning:** this value gets reset any time `start()` is used, so it is recommended to cache the current shape using `saveShape()` instead of directly referencing `this.currentShape`.
- `this.cursor` represents the current mouse/touch cursor state
- `this.frame` the current frame (i.e. the number of times `draw()` has run)
- `this.height` the height of the graphic
- `this.keyboard` the current keyboard state
- `this.panelWidth` the width of a single panel in the graphic, only meaningful in conjunction with `setPanelWidth` (see below)
- `this.parameters` the collection of externally passed parameters (via HTML: `data-...` attributes, via JS: a key/value object)
- `this.width` the width of the graphic


### General functions

- `find(qs)` find an HTML elements in the `<graphics-element>` DOM tree, using a query selector
- `findAll(qs)` find all HTML elements that match the provided querySelector. **note:** unlike the DOM API, this function returns a plain array.
- `setPanelCount(int)` use this in `setup()` to let the API know that this graphic is technically a number of "separate" panels of content, setting `this.panelWidth` to `width`/`panelcount`.
- `setSize(width,height)` explicitly resizes the canvas. **warning:** this will reset all color, transform, etc. properties to their default values.
- `toDataURL()` returns the graphic as PNG image, encoded as a data URL.


### Maths functions

- `abs(v)` get the absolute value
- `approx(v1, v2, epsilon = 0.001)` check whether v1 differs from v2 by no more than `epsilon`
- `atan2(dy, dx)` [atan2](https://en.wikipedia.org/wiki/Atan2)
- `binomial(n, k)` get the binomial coefficient, i.e. "n choose k"
- `ceil(v)` round any fractional number up to the next highest interger
- `constrain(v, lowest, highest)` restrict a value in its lowest and highest value.
- `cos(v)` cosine
- `dist(x1, y1, x2, y2)` the euclidean distance between (x1,y1) and (x2,y2)
- `floor(v)` round any fractional number to an integer by discarding its fractional part
- `map(v, fromStart, fromEnd, toStart, toEnd, constrain = false)` compute a value on an interval [fromStart,fromEnd] to its corresponding value on the interval [toStart,toEnd], with optional constraining to that new interval.
- `max(...v)` find the highest number in two or more numbers
- `min(...v)` find the lowest number in two or more numbers
- `random()` generate a random value between 0 (inclusive) and 1 (exclusive)
- `random(a,b)` generate a random value between `a` (inclusive) and `b` (exclusive)
- `random(v)` generate a random value between 0 (inclusive) and `v` (exclusive)
- `round(v)` round any fractional number by applying `ceil` for any number with fractional part >= 0.5, and `floor` for any number with fractional part < 0.5.
- `sin(v)` sine
- `sqrt(v)` square root
- `tan(v)` tangent

### Property functions

- `noColor()` set both stroke and fill color to "transparent"
- `noFill()` set the fill color to "transparent"
- `noGrid()` do not draw a background grid
- `noLineDash()` do not use line dashing for strokes
- `noShadow()` do not use shape shadows
- `noStroke()` set the stroke color to "transparent"
- `noTextStroke()` disable text outline
- `setBorder(width = 1, color = "black")` set the canvas border width and color
- `setColor(color)` set the color for both shape stroke and fill
- `setCursor(type)` set the CSS cursor type. `POINTER`, `HAND`, and `CROSS` constants are provided, other values must be supplied as string.
- `setFill(color)` set the fill color
- `setFont(font)` set the text font, using [CSS font syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/font)
- `setFontFamily(name)` set the font to be used, by name
- `setFontSize(px)` set the font size in pixels
- `setFontWeight(val)` set the font weight in CSS weight units
- `setGrid(size, color)` set the background grid's spacing and line coloring
- `setLineDash(...values)` set the interval values for [dashed lines](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)
- `setShadow(color, px)` set the color and blur distance for drawing shape shadows
- `setStroke(color)` set the stroke color
- `setTextStroke(color, weight)` set the text outline stroke color and width (in pixels)
- `setWidth()` reset the stroke width to be 1 pixel wide
- `setWidth(width)` set the stroke width to a custom value, in pixels

For coloring purposes, there is also the `randomColor` function:

- `randomColor()` returns a random, full opaque CSS color
- `randomColor(opacity)` returns a random CSS color with the indicated opacity (in interval [0,1])
- `randomColor(opacity, cycle=false)` if the second parameter is explicitly set to `false`, the random seed used to generate the random color will not be updated, and the resulting random color will be the same as when the function was previously called.

For temporary work, where you might want to change some properties and then revert to the previous state, there are two functions available:

- `save()` cache the current collection of properties. This uses a stack, with each call adding a new "snapshot" on the stack.
- `restore()` restore the most recently cached state from the stack.

### Coordinate transform function

- `rotate(angle)` rotate the coordinate system by `angle` (clockwise, in radians)
- `scale(x, y)` scale the coordinate system by a factor of `x` horizontally, and `y` vertically
- `translate(x, y)` move the coordinate system by `x` units horizontally, and `y` units vertically
- `resetTransform()` reset the coordinate system to its default values
- `transform(a,b,c,d,e,f)` transform the coordinate system by applying a transformation matrix to it. This matrix has the form:

```
    | a b c |
m = | d e f |
    | 0 0 1 |
```

**note:** all transforms are with respect to (0,0) irrespective of where (0,0) has been moved to through successive transforms.

In addition to transformations, there are also two functions to allow you to map screen coordinates (e.g. cursor position) to their corresponding transformed coordinate, and vice versa, to allow for drawing/computing points in either coordinate system

- `screenToWorld(x, y)` converts a screen coordinate (x,y) to its corresponding transformed coordinate system coordinate (x',y')
- `worldToScreen(x, y)` converts a transformed coordinate system coordinate (x,y) to its corresponding screen coordinate (x', y')

### Drawing functions

- `arc(x, y, r, s, e)` draw a section of outline for a circle with radius `r` centered on (x,y), starting at angle `s` and ending at angle `e`.
- `circle(x, y, r)`  draw a circle at (x,y) with radius `r`
- `clear(color="white", preserveTransforms=false)` clears the graphics to a specific CSS background color, resetting the transform by default.
- `drawAxes(hlabel, hs, he, vlabel, vs, ve, w, h)` draw a set of labelled axes, using `{hlabel, hs, he}` as horizontal label, with start marker `hs` and end marker `he`, and using `{vlabel, vs, ve}` as vertical label, with start marker `vs` and end marker `ve`
- `drawGrid(division = 20)` draw a grid with the specified spacing, colored using the current stroke color
- `drawShape(...shapes)` draw one or more saved full shapes (see below)
- `image(img, x = 0, y = 0, w = auto, h = auto)` draw an image at some (x,y) coordinate, defaulting to (0,0), scaled to some width and height, defaulting to the native image dimensions
- `line(x1, y1, x2, y2)` draw a line from (x1,y1) to (x2,y2)
- `plot(fn, start = 0, end = 1, steps = 24, xscale = 1, yscale = 1)` plot a function defined by `fn` (which must take a single numerical input, and output an object of the form `{x:..., y:...}`) for inputs in the interval [start,end], at a resolution of `steps` steps, with the resulting values scaled by `xscale` horizontally, and `yscale` vertically. This function returns the plot as a `Shape` for later reuse.
- `point(x, y)` draw a single point at (x,y)
- `rect(x, y, w, h)` draw a rectangle from (x,y) with width `w` and height `h`
- `redraw()` triggers a new draw loop. Use this instead of calling `draw()` directly when you wish to draw a new frame as part of event handling.
- `text(str, x, y, alignment = LEFT)` place text, colored by the fill color, anchored to (x,y), with the type of anchoring determined by `alignemtn`. The alignment constants `LEFT`, `RIGHT`, and `CENTER` are available.
- `wedge(x, y, r, s, e)` similar to arc, but draw a full wedge

#### Shape drawing functions

- `start(type = POLYGON, factor)` set up a new `Shape` as `this.currentShape` in preparation for receiving data. Types can be `POLYGON` (default), `CURVE` (Catmull-Rom), or `BEZIER`. If `CURVE` is specified, the `factor` indicates how loose or tight the resulting Catmull-Rom curve will be.
- `segment(type, factor)` set up a new section of the shape. If left unspecified the `type` and `factor` are inherited from the current `Shape`.
- `vertex(x, y)` add a point to the current `Shape`'s current segment.
- `end(close = false)` draw the current `Shape`
- `saveShape()` returns the current shape for later reuse


## Built-in object types

### Shape

The `Shape` class reprents a drawable shape consisting of one or more polygonal, Catmull-Rom curve, or Bezier curve segments. It has a minimal API:

- **`new Shape(type, factor, points = [])`** construct a new `Shape` of the specified `type` (options are `Shape.POLYGON`, `Shape.CURVE` for Catmull-Rom curves, and `Shape.BEZIER` for Bezier curves), with the specified `factor` (used for Catmull-Rom curve tightness), and optional list of points to prepopulate the first shape segment.
- `merge(other)` merge another `Shape`'s segments into this `Shape`
- `copy()` returns a copy of this `Shape`
- `newSegment(type, factor)` start a new segment in this `Shape` of the indicated type, with the indicated tightness factor.
- `vertex(p)` add an on-shape coordinate (x,y) to this `Shape`. How this vertex contributes to the overall shape drawing depends on the current segment type.


### Vector

The `Vector` class represents a 2d/3d coordinate, with a minimal standard API:

- **`new Vector(x,y,z?) /  new Vector({x:,y:,z:}`** construct a new `Vector`
- `vector.dist(other, y, z = 0)` calculate the distance to some other vector-as-coordinate
- `vector.normalize(f)` return a new `Vector` representing a scaled copy of this vector, with length 1.0
- `vector.getAngle()` get the angle between this vector and the x-axis.
- `vector.reflect(other)` reflect this vector-as-coordinate over the line that some other vector lies on
- `vector.add(other)` return a new `vector` representing the addition of some other vector to this vector
- `vector.subtract(other)` return a new `vector` representing the subtraction of some other vector to this vector
- `vector.scale(f = 1)` return a new `vector` representing the scaled version of this vector


### Matrix

The `Matrix` class represents an `N`x`M` matrix, with minimal standard API:

- **`new Matrix(n,m,data?)`** construct a new `Matrix`. If `data` is provided, the matrix will be filled with that. **warning:** `data` is assumed to be `n` x `m`, but is **not** validated.
- `setData(data)` **warning:** `data` is assumed to be `n` x `m`, but is **not** validated.
- `get(i, j)` get the value at row `i` and column `j`
- `set(i, j, value)` set the value at row `i` and column `j`
- `row(i)` get the entire `i`th row as an array of values
- `col(j)` get the entire `j`th column as a (flat) array of values
- `multiply(other)` return a new `Matrix` representing the right-multiplication of this matrix with some other matrix
- `invert()` return a new `Matrix` representing the inverse of this matrix, or `undefined` if no inverse exists
- `transpose()` return a new `Matrix` representing the transpose of this matrix


### Bezier

The `Bezier` class is an instance of [bezier.js](https://pomax.github.io/bezierjs/) with all its API functions, extended for use on the canvas:

- static `defaultQuadratic(apiInstance)` returns a new quadratic `Bezier` with preset coordinate values tailored to the Primer on Bezier Curves. The `apiInstance` must be a reference to a valid Graphics-API instance (typically thiat will simply be `this` in your code).
- static `defaultCubic(apiInstance)` returns a new cubic `Bezier` with preset coordinate values tailored to the Primer on Bezier Curves. The `apiInstance` must be a reference to a valid Graphics-API instance (typically thiat will simply be `this` in your code).
- static `fitCurveToPoints(apiInstance, points, tvalues)` returns a new `n`-dimensional `Bezier` that has been fit to the provided list of points, constrained to the provided `tvalues`, using MSE polygonal curve fitting. The `apiInstance` must be a reference to a valid Graphics-API instance (typically thiat will simply be `this` in your code).


The extended API in addition to these static functions are:

- **`new Bezier(apiInstance, ...coords)`** construct a new `Bezier` curve controlled by three or more points, either supplied as numerical arguments, or as point objects `{x:..., y:..., z?:...}` where `z` is optional. The `apiInstance` must be a reference to a valid Graphics-API instance (typically thiat will simply be `this` in your code).
- `project(x, y)` returns an `{x:..., y:...}` object representing the projection of some point (x,y) onto this curve.
- `getPointNear(x, y, d = 5)` returns either `undefined`, or one of the `Bezier` curve's control points if the specified (x,y) coordinate is `d` or fewer pixels from a control point.
- `drawCurve(color = #333)` draws this curve on the canvas, with optional custom color
- `drawPoints(labels = true)` draws the curve's control points, with optional coordinate labels (defaulting to true)
- `drawSkeleton(color = #555)` draws this curve's coordinate polygon, with optional custom color
- `getStrutPoints(t)` get the list of points obtained through "de Casteljau" interpolation, for a given `t` value
- `drawStruts(t, color = "black", showpoints = true)` draws this curve's "de Casteljau" points and lines, for a given `t` value, with optional custom color, and optional omission of the points if only the lines are required.
- `drawBoundingBox(color = "black")` draw the axis-aligned bounding box for this `Bezier` curve with optional custom color

### BSpline

The `BSpline` class represents a generic [B-spline](https://en.wikipedia.org/wiki/B-spline) curve, with a minimal API:

- **`new BSpline(apiInstance, points)`** constructs a B-spline controlled by a points array in which each element may be either of the form `{x: ..., y: ...}` or a numerical tuple `[x,y]`. The `apiInstance` must be a reference to a valid Graphics-API instance (typically thiat will simply be `this` in your code).
- `getLUT(count)` returns an array of `count` coordinates of the form `{x:...,y:...}`, representing a polygonal approximation of this `BSpline`.
- `formKnots(open = false)` set-and-return the list of B-spline knots using either the standard uniform interval spacing, or if `open` is set to `true`, special spacing to effect a B-spline that start and ends at the actual start and end coordinates. The knot array returned in this fashion is a live array, and updating its values **will** change the B-spline's shape.
- `formUniformKnots()` set-and-return uniformaly spaced knot values. The knot array returned in this fashion is a live array, and updating its values **will** change the B-spline's shape.
- `formWeights()` set-and-return the array of weights. These will all be uniformly initialized to 1, with the weight array returned being a live array, so that updating its values will change the B-spline's shape.
