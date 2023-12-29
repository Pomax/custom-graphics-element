let hitCircle;
const points = [];

/**
 * The main setup function
 */
function setup() {
  setSize(500, 300);
  for (let i = 50; i < 500; i += 100) {
    points.push(new Point(i, 150));
  }
  setMovable(points);
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
    setStroke(`red`);
    circle(x, y, 30);
    circle(x, y, 20);
    circle(x, y, 10);
  }

  // then draw some axes
  setStroke(`black`);
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

  // And since we have five points, let's draw the two
  // bezier curves we can make with that:
  setStroke(`blue`);
  bezier(points.slice(0, 4));
  setStroke(`red`);
  bezier(points.slice(1, 5));

  // As well as the B-spline based on those points:
  setStroke(`purple`);
  bspline(points);
}

// When someone clicks/touches the graphics pane,
// record the location where they did that so we
// can persistently show that location.
function pointerDown(x, y) {
  hitCircle = new Point(x, y);
  redraw();
}
