let hitCircle;
const points = [];

/**
 * What does our program do?
 */
function getDescription() {
  return `
  <p>
    Click-drag (or touch-slide) points to move them around in our graphics
    pane, and reveal a bunch of curves that have been fit to our point
    collection (there's a polygon, two Bezier curves, a cardinal spline, and
    even a B-spline. Can you identify each?)
  </p>
  `;
}

/**
 * The main setup function
 */
function setup() {
  setSize(500, 300);
}

/**
 * The main draw function
 */
function draw() {
  // clear the graphics pane and move the coordinate system
  // so that we can draw things on (0,0) and still see them.
  clear();
  translate(30, 30);

  // if the user clicked/touched the graphics pane, show where:
  if (hitCircle) {
    const { x, y } = hitCircle;
    noFill();
    setStroke(`#F002`);
    circle(x, y, 30);
    setStroke(`#F008`);
    circle(x, y, 20);
    setStroke(`#F00F`);
    circle(x, y, 10);
  }

  // then draw some axes
  setColor(`black`);
  axes(`x`, 0, width - 40, `y`, 0, height - 40);

  // then draw the polygon that connects our points
  noFill();
  setStroke(`black`);
  start();
  points.forEach((p) => vertex(p.x, p.y));
  end();

  // And the points themselves.
  setFill(`red`);
  noStroke();
  points.forEach((p) => point(p.x, p.y));
  noFill();

  // Also  draw a cardinal spline through all our points!
  setStroke(`green`);
  spline(points);
}

// When someone clicks/touches the graphics pane,
// record the location where they did that so we
// can persistently show that location.
function pointerDown(x, y) {
  hitCircle = new Point(x, y);
  redraw();
}
