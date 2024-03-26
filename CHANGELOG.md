# How this library is versioned

As of `v2.0.2` this library _strictly_ adheres to [semver](https://semver.org)'s major.minor.patch versioning:

- patch version changes indicate bug fixes and/or internal-only code changes,
- minor version changes indicate new functionality that does not break backward compatibility,
- major version changes indicate backward-incompatible external API changes, no matter how small.

Note that there may be gaps in the version history, which may happen if a release is pushed to npm but a problem is discovered fast enough to warrant an unpublish.

# Version history

## v2.2.0

- added support for variable presets using `data-*` attributes, (see the
  "[Using data-\* attributes](./docs.html#using-data-attributes)" section on
  the documentation page for more information.
- added documentation for handling load/error events, see the
  "[Load and error events](#load-and-error-events)" section on the documentation
  page for more information.
- added code that ensures that the `GraphicsElement` class exists globally as part
  of loading the custom element.

## v2.1.0

- added `startShape`, `endShape`, and `newSegment` for working with shapes. At present
  shapes can only be used to model polygonal edges, but these will be extended in a
  future version to allow for curved edges.

## v2.0.4

- moved the build tools into their own `tools` directory
- tightened up the comments that were generated into the `graphics-element.d.ts` file
- updated `docs.html` to cover how to use `graphics-element.d.ts` with VS Code
- added documentation to the `generate-placeholders.js` script

## v2.0.3

- added this change log.

## v2.0.2

- New build system
- Lots of documentation!
- switched functions that took arrays of points to using real arguments
- draw functions that took separate `x` and `y` now also accept `{x,y}` point-likes
- now with `graphics-element.d.ts`
- now with API documentation
- now with fallback images, including generator tool
- removed disablers that didn't have corresponding setters
- changed default label placement for `axes()`
- no draw commands take a shortcut by calling a canvas built-in anymore
- `loadSource` now warns when called with a function
- the `view source` link(s) for inline script work. Not great (thanks Chrome) but they work.

- replaced true `random` with pseudo-random `random` (this also affects `randomColor()`)
- added `randomSeed()`
- added `range()`
- added `array()`

- [bugfix] default addSlider value is now (max+min)/2
- [bugfix] buttons no longer allow a missing onClick handler
- [bugfix] highlight colour works properly now
- [bugfix] crosslinked colour markup in the description resets properly

## v1.11.0

- [bugfix] prevent double-reset when calling `reset()`
- [bugfix] additional sources now get bundled into `view source` properly

## v1.10.0

- parted up the base files for easier build maintenance

- added `project()` based on Cabinet projection
- added `rotateProjector()` based on Cabinet projection
- added `setProjector` based on Cabinet projection

## v1.9.0

- added `point.active`
- added `pointerActive(bool)`

## v1.8.0

- added `<graphics-source>` for writing "inline script"

## v1.7.6

- [bugfix] fixed `rect()` drawing wrong width and height

## v1.7.5

- reduced `huge` from 1000000000 to 1000000

  1.7.3

- prevent event propagation for touch events

## v1.7.1

- [bugfix] "pointer near movable" runs the correct arithmetic

## v1.7.0

- improved pointer handling

## v1.6.4

- added `getDescription()` to set the graphics guide text from source.

## v1.6.3

- added `<graphics-element>` to cdnjs: https://cdnjs.com/libraries/graphics-element

## v1.6.2

- `addButton` and `addSlider` return their respective DOM nodes

## v1.6.0

- added `degrees()`
- added `radians()`

## v1.5.0

- added `frameDelta` which tracks the time (in milliseconds) since the last frame
- added a playground editor

## v1.4.2

- [bugfix] don't double-generate sliders and buttons on reset

## v1.4.1

- added `addButton()` to add off-canvas buttons.

## v1.3.3

- switched from fixed number of "additional sources" to "however many your markup has"

## v1.3.0

- added additional source loading using `<source>`, with support for additional `setup()` and `draw()` in those sources

## v1.0.0

initial release.
