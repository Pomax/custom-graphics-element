/**
 * Start a new shape.
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
 * @see {@link start}
 */
function startShape() {
  return (__shape = new Shape());
}

/**
 * Clear the current shape, optionally closing it.
 *
 * @param {boolean} close? When used, closes the shape's current subpath.
 * @returns {Shape} The shape that got closed
 *
 * @see {@link end}
 */
function endShape(close = false) {
  if (__shape && close) __shape.close();
  const shape = __shape;
  __shape = undefined;
  return shape;
}

/**
 * Start a new sub path in a shape.
 *
 * @param {boolean} close? Closes the current segment before opening a new one (default = true)
 *
 * @see {@link startShape}
 * @see {@link endShape}
 */
function newSegment(close = true) {
  __shape?.newSegment(close);
}
