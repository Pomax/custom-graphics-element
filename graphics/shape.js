let shape, subpath;

function setup() {
  setSize(600, 400);
  shape = startShape();
  shape.allowResizing(true);
  setMovable(shape);
}

function draw() {
  clear(`white`);
  noFill();
  setStroke(`red`);
  setFill(`#f002`);
  const result = shape.inside(pointer.x, pointer.y);
  if (result.length) {
    setStroke(shape.dragging ? `blue` : `green`);
    setFill(shape.dragging ? `#00F2` : `#0F02`);
  }
  shape.draw(true);
}

function pointerDown(x, y) {
  const subpaths = shape.inside(x, y);
  if (subpaths.length) {
    shape.dragging = true;
    subpath = subpaths[0].id;
  }
}

function pointerUp(x, y) {
  if (pointer.drag && shape.dragging) {
    shape.commit();
  } else if (!currentMovable) {
    shape.add(x, y);
  }
  redraw();
}

function pointerMove() {
  redraw();
}

function pointerDrag() {
  if (!currentMovable && shape.dragging) {
    shape.offset(
      pointer.x - pointer.mark.x,
      pointer.y - pointer.mark.y,
      subpath
    );
  }
  redraw();
}

function keyDown(key) {
  if (key === `s`) {
    shape.newPath();
    redraw();
  }
  if (key === `c`) {
    shape.newPath(true);
    redraw();
  }
}
