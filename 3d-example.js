const top = [
  new Vector(0, 0, 0),
  new Vector(100, 0, 0),
  new Vector(100, 100, 0),
  new Vector(0, 100, 0),
];

const bottom = [
  new Vector(0, 0, 100),
  new Vector(100, 0, 100),
  new Vector(100, 100, 100),
  new Vector(0, 100, 100),
];

const all = [...top, ...bottom];

let projector;

function setup() {
  projector = new CabinetProjector(new Vector(width / 2, height / 2));
  noGrid();
}

function draw() {
  clear();

  setColor(`black`);
  const tops = top.map((p) => projector.project(p));
  const bottoms = bottom.map((p) => projector.project(p));
  [...tops, ...bottoms].forEach((p) => point(p.x, p.y));
}
