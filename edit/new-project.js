function getDescription() {
  return `
    <p>
      Add some text here, or if you don't want guide text,
      just remove the entire function.
    </p>
  `;
}

function setup() {
  setSize(600, 400);
  setBorder(1, `black`);
  setGrid(20, `grey`);
}

function draw() {
  setCursor(`none`);
  clear(`white`);
  // what happens next is up to you!
  setColor(`black`);
  point(pointer.x, pointer.y);
}

function pointerMove() {
  redraw();
}
