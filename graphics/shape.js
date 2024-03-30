let shape, mode = 0;

const caps = [
  () => shape.splineTo(50, 150, 0.55),
  () => shape.splineTo(55, 175, 55, 125, 0.9),
  () => shape.quadTo(50, 200, 50, 150, 50, 100, 100, 100),
  () => shape.curveTo(33, 200, 33, 100, 100, 100)
];


function setup() {
  setSize(600, 400);
  reset();
}

function reset() {
  shape = startShape();
  shape.allowResizing(true);
  shape.showPoints(true);
  setMovable(shape);
  shape.moveTo(100, 100);
  shape.lineTo(200, 100, 200, 200, 100, 200);
  caps[mode]();
  shape.close();
}

async function draw() {
  clear(`white`);
  noFill();
  translate(100, 0);
  const result = shape.inside(pointer.x, pointer.y);
  if (result.length) {
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
