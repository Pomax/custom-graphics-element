const points = [];
let ppt;

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  for (let i = 50; i < 500; i += 100) {
    points.push(new Point(i, 150));
  }
  setMovable(points);
}

/**
 * The master draw function
 */
function draw() {
  clear();

  setStroke(`black`);
  translate(30, 30);
  axes(`x`, 0, width - 40, `y`, 0, height - 40);

  noFill();
  setStroke(`black`);
  start();
  points.forEach((p) => vertex(p.x, p.y));
  end();

  setFill(`red`);
  noStroke();
  points.forEach((p) => point(p.x, p.y));

  noFill();
  setStroke(`green`);
  spline(points);

  setStroke(`blue`);
  bezier(points.slice(0, 4));

  setStroke(`red`);
  bezier(points.slice(1, 5));

  setStroke(`purple`);
  bspline(points);

  if (ppt) {
    circle(ppt.x, ppt.y, 30);
    circle(ppt.x, ppt.y, 20);
    circle(ppt.x, ppt.y, 10);
  }
}

function pointerDown(x, y) {
  ppt = new Point(x, y);
  redraw();
}
