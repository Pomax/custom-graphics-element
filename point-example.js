class Point {
  constructor(api, x = 0, y = 0) {
    this.api = api;
    this.x = x;
    this.y = y;
  }
  draw() {
    const { api, x, y } = this;
    api.circle(x, y, 5);
  }
}

const points = [];

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  for (let i = 50; i < 500; i += 100) points.push(new Point(this, i, 150));
  setMovable(points);
}

/**
 * The master draw function
 */
function draw() {
  clear();
  noFill();
  setStroke(`black`);
  drawPolygon(points);
  setFill(`red`);
  noStroke();
  points.forEach((p) => p.draw());
}
