const points = [];

/**
 * ...
 */
function setup() {
  setGrid(20, `black`);
  setBorder(1, `black`);
  addSlider(`radius`, { min: 1, max: 100, step: 1, value: 80 });
  addSlider(`angle`, { max: TAU.toFixed(3), step: 0.001, value: 0.5 });
  // todo: set up a persistent "initial transform", so that
  //       we can set (0,0) to be the middle of the screen,
  //       or the lower left, etc.
  points.push(new Circle(width / 2, height / 2, radius));
  points.push(new Circle(width / 2, height / 2 - radius, 4));
}

/**
 * ...
 */
function draw() {
  clear();
  const a = angle - PI / 2;
  const cx = width / 2;
  const cy = height / 2;

  const [_, p] = points;
  _.r = radius;
  p.x = cx + radius * cos(a);
  p.y = cy + radius * sin(a);

  noFill();
  setStroke(`black`);
  points.forEach((p) => circle(p.x, p.y, p.r));
  line(cx, cy, p.x, p.y);

  setStroke(`grey`);
  line(cx, cy + radius * sin(a), p.x, p.y);
  line(cx + radius * cos(a), cy, p.x, p.y);

  setStroke(`blue`);
  line(cx, cy, cx + radius * cos(a), cy);

  setStroke(`red`);
  line(cx, cy, cx, cy + radius * sin(a));

  setStroke(`darkblue`);
  line(cx + radius * cos(a), cy, cx + radius * sec(a), cy);

  setStroke(`brown`);
  line(cx, cy + radius * sin(a), cx, cy + radius * csc(a));

  setStroke(`orange`);
  const t = tan(a) * radius;
  line(p.x, p.y, p.x + t * sin(a), p.y - t * cos(a));

  setStroke(`purple`);
  const ct = ctn(a) * radius;
  line(p.x, p.y, p.x - ct * sin(a), p.y + ct * cos(a));
}

/**
 * ...
 */
function pointerClick(x, y) {
  console.log(`click`, x, y);
  togglePlay();
}

/**
 * ...
 */
function keyDown(key) {
  if (key === ` `) {
    togglePlay();
  }
}
