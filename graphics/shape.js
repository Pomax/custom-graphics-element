let shape,
  mode = 0;

const caps = [
  (s) => shape.splineTo(150 - s * 100, 150, 0.55),
  (s) =>
    shape.splineTo(
      150 - s * 95,
      150 + s * 125,
      150 - s * 95,
      150 - s * 25,
      0.9
    ),
  (s) =>
    shape.quadTo(
      150 - s * 95,
      150 + s * 50,
      150 - s * 100,
      150,
      150 - s * 100,
      150 - s * 50,
      150 - s * 50,
      150 - s * 50
    ),
  (s) =>
    shape.curveTo(
      150 - s * 117,
      150 + s * 50,
      150 - s * 117,
      150 - s * 50,
      150 - s * 50,
      150 - s * 50
    ),
];

function setup() {
  setSize(600, 400);
  reset();
}

function reset() {
  shape = startShape();
  shape.allowResizing(true);
  shape.showPoints();
  setMovable(shape);
  addPoints(2.0);
  addPoints(1.5, true);
  addPoints(1.0);
  addPoints(0.75, true);
  addPoints(0.5);
  addPoints(0.25, true);
  shape.close();
}

function addPoints(scale, clockwise) {
  const s = scale;
  shape.newSegment(true);
  shape.moveTo(150 - s * 50, 150 - s * 50);
  shape.lineTo(
    150 + s * 50,
    150 - s * 50,
    150 + s * 50,
    150 + s * 50,
    150 - s * 50,
    150 + s * 50
  );
  caps[mode](scale);
  if (clockwise) shape.flipSegment();
}

async function draw() {
  clear(`white`);
  noFill();
  translate(100, 0);
  if (shape.inside(pointer.x, pointer.y)) {
    shape.setStroke(pointer.drag ? `blue` : `green`);
    shape.setFill(pointer.drag ? `#00F2` : `#0F02`);
  } else {
    shape.setStroke(`red`);
    shape.setFill(`#f002`);
  }
  await shape.draw();
}

function pointerUp(x, y) {
  if (!currentMovable) {
    shape.add(x, y);
  }
  redraw();
}

function pointerMove() {
  redraw();
}

function keyDown(key) {
  if (key === `s`) {
    shape.newSegment();
    redraw();
  }
  if (key === `c`) {
    shape.newSegment(true);
    redraw();
  }
  if (key === `n`) {
    mode = (mode + 1) % caps.length;
    reset();
    redraw();
  }
}
