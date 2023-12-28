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
  noGrid();
}

/**
 * The master draw function
 */
function draw() {
  clear();

  noFill();
  setStroke(`black`);
  start();
  points.forEach((p) => vertex(p.x, p.y));
  end();

  setFill(`red`);
  noStroke();
  points.forEach((p) => point(p.x, p.y));

  noFill();
  setStroke(`red`);
  spline(points);

  setStroke(`blue`);
  bezier(points.slice(0, 4));

  setStroke(`green`);
  bezier(points.slice(1, 5));

  setStroke(`purple`);
  bspline(points);

  if (ppt) {
    circle(ppt.x, ppt.y, 30);
    circle(ppt.x, ppt.y, 20);
    circle(ppt.x, ppt.y, 10);
  }
}

function pointerDown() {
  const { x, y } = pointer;
  console.log(x, y);
  ppt = new Point(x, y);
}
