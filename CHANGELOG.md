# How this library is versioned

As of `v2.0.2` this library _strictly_ adheres to [semver](https://semver.org)'s major.minor.patch versioning:

- patch version changes indicate bug fixes and/or internal-only code changes,
- minor version changes indicate new functionality that does not break backward compatibility,
- major version changes indicate backward-incompatible external API changes, no matter how small.

Note that there may be gaps in the version history, which may happen if a release is pushed to npm but a problem is discovered fast enough to warrant an unpublish.

# Current Version

## v6.2.2 (August 8, 2024)

- [bugfix] `dist()` with two Point-like inputs would yield the wrong result.

# Previous Versions

## v6.2.1 (June 24, 2024)

- added `createProjector(Symbol)` for creating cabinet or homogeneous projectors without binding them as active projector.
- added a second argument to `setProjector` that controls whether or not to automatically project 3D to 2D or not. By default this value is `true`. This differs from `createProjector` in that the projector _does_ get bound as the active projector.

## v6.1.0 (June 22, 2024)

- added the `safemode` attribute, which will run graphics code with all loops wrapped such that "probable infinite loops" throw an error. This is particularly useful when dealing with user-generated graphics code (_especially_ in collaborative code editing context) where someone might write `while(true)` and lock up the JS thread with a spin loop, or something like `for(let i=100; i>=0; i++)` where an honest mistake (a `++` that should have been `--`) leads to a locked page. If you're dealing with any sort of user-generated content, you'll want to make sure to use this attribute!

## v6.0.0 (June 16, 2024)

- [bugfix] fixed the `inside` test for shapes on Chrome, because Google never bothered to update the way it handles `isPointInFill` and friends. Even though one of their own is an editor on the SVG2 spec.

This version has completely rewritten 3D projection code so that you no longer need to manually project every single coordinate. Instead, you set up a projector (which can be either a cabinet or homogeneous projector), which then also automatically turns on 3D to 2D projection for various draw functions.

- added `setProjector`,
- added `noProjector` to disable projection
- added `useProjection` and `noProjection` to toggle projection behaviour on/off during the draw loop
- added `poly` function for drawing polygons from arrays of points.

- updated the various draw commands so that they automatically perform projection mapping when projection is enabled: `line`, `point`, `poly`, `vertex`.
- not yet updated: `arc`, `circle`: these need some way to indicate which plane they lie in.
- net yet updated:`bezier`, `bspline`, `spline`; these need to understand 3d inputs before they can be made projective.

**BREAKING CHANGES**

The way projection works changed, so any graphics written for previous versions of `<graphics-element>` that use explicit calls to `project` should be updated to no longer use those.

As example, if you had code like this:

```js
...
function drawAxes() {
  const axelen = huge / 10;
  setColor(`darkred`);
  line(project(-axelen, 0, 0), project(axelen, 0, 0));
  setColor(`darkblue`);
  line(project(0, 0, -axelen), project(0, 0, axelen));
  setColor(`darkgreen`);
  line(project(0, -axelen, 0), project(0, axelen, 0));
}
...
```

You now need to say which projector you want to use, after which you don't need explicit calls to `project`:

```js
function setup() {
  ...
  setProjector(CABINET);
}
...
function drawAxes() {
  const axelen = huge / 10;
  setColor(`darkred`);
  line(-axelen, 0, 0, axelen, 0, 0);
  setColor(`darkblue`);
  line(0, 0, -axelen, 0, 0, axelen);
  setColor(`darkgreen`);
  line(0, -axelen, 0, 0, axelen, 0);
}
...
```

## v5.0.0 (March 31, 2024)

- `Shape` now supports cut-outs. See the "Shapes" example in the [editor](https://pomax.github.io/custom-graphcs-element/edit.html).
- [bugfix] Movable points could get covered by a shape.

**BREAKING CHANGES** As a consequence of adding cutout support, the `inside()` check function no longer returns a list of segments, but a boolean.

## v4.0.0 (March 30, 2024)

- Backdated the change log.
- Freed up `halt` as available variable/function name in your code.
- Freed up `reset` as available variable/function name in your code.
- [docs] Added mention of <code>async</code> setup and draw functions to the "writing graphics source code" section.
- [dev-only] Added a jsconfig.json to the `graphics-element/api` dir, so api code comes with type-hinting.

**BREAKING CHANGES** `Shape` got a rewrite to be a "real" shape, with path construction commands similar to SVG. See
the documentation for [startShape](https://pomax.github.io/custom-graphics-element/api.html#startShape)
for more information.

## v3.0.1 (March 29, 2024)

- Added an export for `GraphicsElement` and `GraphicsSource` so you construct instances without having to use `document.createElement`.
- [bugfix] Pointer.drag did not set/unset correctly
- [bugfix] Spline(..., virtual, T) did not correctly destructure virtual and T

## v3.0.0 (March 26, 2024)

- [bugfix] Fixed a bug in the code responsible for tracking the `currentMovable` delta.

**BREAKING CHANGES** Major version update, as `currentPoint` was renamed to `currentMovable` in v2.1.0

## v2.2.0 (March 25, 2024)

- Added support for variable presets using `data-*` attributes, (see the
  "[Using data-\* attributes](https://pomax.github.io/custom-graphics-element/docs.html#using-data-attributes)" section on
  the documentation page for more information.
- Added code that ensures that the `GraphicsElement` class exists globally as part of loading the custom element.
- [docs] Added documentation for handling load/error events, see the
  "[Load and error events](https://pomax.github.io/custom-graphics-element/docs.html#load-and-error-events)" section on the documentation
  page for more information.

**NOTE**: This release was given the wrong version number, as it includes the
breaking change that renamed `currentPoint` to `currentMovable`.

## v2.1.0 (March 25, 2024)

- Added `startShape`, `endShape`, and `newSegment` for working with shapes. At present
  shapes can only be used to model polygonal edges, but these will be extended in a
  future version to allow for curved edges.

**NOTE**: This release was given the wrong version number, as it introduced a
breaking change that renamed `currentPoint` to `currentMovable`.

## v2.0.4 (March 16, 2024)

- Tightened up the comments that were generated into the `graphics-element.d.ts` file.
- [docs] Updated `docs.html` to cover how to use `graphics-element.d.ts` with VS Code.
- [docs] Added documentation to the `generate-placeholders.js` script.
- [dev-only] Moved the build tools into their own `tools` directory.

## v2.0.3 (March 15, 2024)

- Added this change log.

## v2.0.2 (March 15, 2024)

- New build system.
- Lots of documentation!
- Switched functions that took arrays of points to using real arguments.
- Draw functions that took separate `x` and `y` now also accept `{x,y}` point-likes.
- Now with `graphics-element.d.ts`.
- Now with API documentation.
- Now with fallback images, including generator tool.
- Removed disablers that didn't have corresponding setters.
- Changed default label placement for `axes()`.
- No draw commands take a shortcut by calling a canvas built-in anymore.
- `loadSource` now warns when called with a function.
- The `view source` link(s) for inline script work. Not great (thanks Chrome) but they work.

- Replaced true `random` with pseudo-random `random` (this also affects `randomColor()`).
- Added `randomSeed()`.
- Added `range()`.
- Added `array()`.

- [bugfix] Default addSlider value is now (max+min)/2.
- [bugfix] Buttons no longer allow a missing onClick handler.
- [bugfix] Highlight colour works properly now.
- [bugfix] Crosslinked colour markup in the description resets properly.

**BREAKING CHANGES** pretty much everything.

## v1.11.0 (March 8, 2024)

- [bugfix] Prevent double-reset when calling `reset()`.
- [bugfix] Additional sources now get bundled into `view source` properly.

## v1.10.0 (March 7, 2024)

- Added `project()` based on Cabinet projection.
- Added `rotateProjector()` based on Cabinet projection.
- Added `setProjector` based on Cabinet projection.
- [dev-only] Parted up the base files for easier build maintenance.

## v1.9.0 (March 2, 2024)

- Added `point.active`.
- Added `pointerActive(bool)`.

## v1.8.0 (March 2, 2024)

- Added `<graphics-source>` for writing "inline script".

## v1.7.6 (February 23, 2024)

- [bugfix] Fixed `rect()` drawing wrong width and height.

## v1.7.5 (January 19, 2024)

- Reduced `huge` from 1000000000 to 1000000.

## 1.7.3 (January 4, 2024)

- Prevent event propagation for touch events.

## v1.7.1 (January 4, 2024)

- [bugfix] "Pointer near movable" runs the correct arithmetic.

## v1.7.0 (January 4, 2024)

- Improved pointer handling.

## v1.6.4 (January 3, 2024)

- Added `getDescription()` to set the graphics guide text from source.

## v1.6.3 (January 1, 2024)

- Added `<graphics-element>` to cdnjs: https://cdnjs.com/libraries/graphics-element

## v1.6.2 (January 1, 2024)

- `addButton` and `addSlider` return their respective DOM nodes.

## v1.6.0 (January 1, 2024)

- Added `degrees()`.
- Added `radians()`.

## v1.5.0 (January 1, 2024)

- Added `frameDelta` which tracks the time (in milliseconds) since the last frame.
- Added a playground editor.

## v1.4.2 (December 31, 2023)

- [bugfix] Don't double-generate sliders and buttons on reset.

## v1.4.1 (December 31, 2023)

- Added `addButton()` to add off-canvas buttons.

## v1.3.3 (December 30, 2023)

- Switched from fixed number of "additional sources" to "however many your markup has".

## v1.3.0 (December 30, 2023)

- Added additional source loading using `<source>`, with support for additional `setup()` and `draw()` in those sources.

## v1.0.0 (December 30, 2023)

initial release.
