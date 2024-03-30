/**
 * Start a new shape. This yields a `Shape` object with the following API:
 *
 * - `makeMovable(movable?: boolean)` - allow this shape to be moved around with the pointer (`movable` is true if omitted)
 * - `allowResizing(allowed?: boolean)` - allow the points that make up this shape to be moved around (`allowed` is true if omitted)
 * - `showPoints(showPoints?: boolean)` - determines whether or not to draw the pathing points on top of the shape during draw().
 * - `close()` - close the current segment so no new points can be added.
 * - `newSegment(closeExisting?: boolean)` - start a new segment in this shape, w
 *
 * A Shape also supports the following utility functions:
 *
 * - `offset(x, y)` - (temporarily) move this shape by (x,y)
 * - `commit()` - commit the temporary offset by rewriting all coordiantes.
 * - `reset()` - reset the shape to having no offset.
 * - `draw()` - draws the shape using its current stroke, fill, and "show points" settings.
 * - `inside(x, y): segment[]` - returns the list of all segments that (x,y) is inside of.
 *
 * And it supports the following pathing functions, with arguments that can either consist of
 * (the necessary number of) pairs of coordinate values, or (the necessary number of) pointlikes,
 * being objects with an `x` and `y` property.
 *
 * - `moveTo(x,y OR p:pointLike)` - start a new segment and mark its path as starting at (x,y).
 * - `lineTo(x,y,... OR p,...)` - add one or more points that connect to the previous point with a straight line.
 * - `quadTo(cx,cy,x,y,... OR cp,p,...)` - add one or more quadratic bezier curves, where (cx,cy)/cp is the control point, and (x,y)/p the end point.
 * - `curveTo(cx1,cy1,cx2,cy2,x,y,... OR c1p,c2p,p,...)` - add one or more cubic bezier curves, which have two control points.
 * - `splineTo(x1,y1,... OR p1,...)` - add one or more cardinal spline pathing coordinates.
 *
 * Cardinal spline coordinates are rendered by treating the path as closed
 * (even if it is not), performing wrap-around lookups as needed in order
 * to draw "something sensible".
 *
 * Note that shape cutouts are not (currently) possible. You'll want to
 * roll your own SVG builder and then turn that SVG into a data-uri that
 * you just render with image() instead if you need cutouts.
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
