/**
 * Start a new shape. This yields a `Shape` object with the following API
 *
 * - `makeMovable(movable?: boolean)` - allow this shape to be moved around with the pointer (`movable` is true if omitted)
 * - `allowResizing(allowed?: boolean)` - allow the points that make up this shape to be moved around (`allowed` is true if omitted)
 *
 * - `add(x, y)` - add a point to the shape's current segment.
 * - `close()` - close the current segment so no new points can be added.
 * - `newSegment(closeExisting?: boolean)` - start a new segment in this shape, w
 *
 * - `offset(x, y)` - (temporarily) move this shape by (x,y)
 * - `commit()` - commit the offset as real coordinates.
 * - `reset()` - reset the shape to having no offset.
 *
 * - `draw(showPoints?)` - draws the shape using the current stroke and fill settings.
 * - `inside(x, y): segment[]` - returns the list of all segments that (x,y) is inside of.
 *
 * Note that shapes do not perform any sort of boolean operations, and
 * defining a shape with a cutout is not possible. You'll want to use
 * SVG images for that, instead. E.g. create an SVG data uri, then use
 * that as `src` for an Image and draw that image using the `image()`
 * function.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     let shape;
 *     function setup() {
 *       setSize(200, 200);
 *       shape = startShape();
 *       shape.allowResizing();
 *       shape.makeMovable();
 *       shape.add(0,height/2);
 *       shape.add(width/2, 0);
 *       shape.add(width, height/2);
 *       shape.add(width/2, height);
 *       shape.close();
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`gold`);
 *       shape.draw(true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @returns {Shape} the newly created shape object
 *
 * @see {@link endShape}
 */
function startShape() {
  return (__shape = new Shape());
}

/**
 * Clear the current shape, optionally closing it.
 *
 * @param {boolean} close? When used, closes the shape's current segment.
 * @returns {Shape} The shape that got closed
 *
 * @see {@link startShape}
 */
function endShape(close = false) {
  if (__shape && close) __shape.close();
  const shape = __shape;
  __shape = undefined;
  return shape;
}

/**
 * Start a new segment in a shape.
 *
 * @param {boolean} close? Closes the current segment before opening a new one (default = true)
 *
 * @see {@link startShape}
 * @see {@link endShape}
 */
function newSegment(close = true) {
  __shape?.newSegment(close);
}
