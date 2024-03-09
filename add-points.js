/**
 * This is a "second" setup function that adds all
 * the points we're going to be able to move around.
 *
 * It will run after our main setup() call, but
 * before draw() gets called.
 */
function setup() {
  for (let i = 50; i < 500; i += 100) {
    points.push(new Point(i - 20, 120));
  }
  setMovable(points);
}

/**
 * Our additional draw function takes advantage of the
 * fact that we know we added five points, so we can
 * draw some extra things:
 */
function draw() {
  // First, let's draw the two bezier curves we can draw:
  setStroke(`blue`);
  bezier(...points.slice(0, 4));
  setStroke(`red`);
  bezier(...points.slice(1, 5));

  // And then let's also draw the B-spline based on those points:
  setStroke(`purple`);
  bspline(...points);
}
