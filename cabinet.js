function setup() {
  setSize(600, 400);
  setBorder(1, `black`);
  setGrid(20, `grey`);
  setProjector(width / 2, height / 2, 50, -0.4);
  play();
}

function draw() {
  setCursor(`none`);
  clear(`white`);
  rotateProjector(frame / 1000, 0, 0);

  drawAxes();
  drawBox();
}

function drawAxes() {
  const axelen = huge / 10;
  setColor(`darkred`);
  line(...project(-axelen, 0, 0), ...project(axelen, 0, 0));
  setColor(`darkblue`);
  line(...project(0, 0, -axelen), ...project(0, 0, axelen));
  setColor(`darkgreen`);
  line(...project(0, -axelen, 0), ...project(0, axelen, 0));
}

function drawBox() {
  setColor(`red`);
  line(...project(-1, -1, -1), ...project(1, -1, -1));
  line(...project(-1, -1, 1), ...project(1, -1, 1));
  line(...project(-1, 1, -1), ...project(1, 1, -1));
  line(...project(-1, 1, 1), ...project(1, 1, 1));

  setColor(`blue`);
  line(...project(-1, -1, -1), ...project(-1, -1, 1));
  line(...project(-1, 1, -1), ...project(-1, 1, 1));
  line(...project(1, -1, -1), ...project(1, -1, 1));
  line(...project(1, 1, -1), ...project(1, 1, 1));

  setColor(`green`);
  line(...project(1, 1, -1), ...project(1, -1, -1));
  line(...project(1, 1, 1), ...project(1, -1, 1));
  line(...project(-1, 1, -1), ...project(-1, -1, -1));
  line(...project(-1, 1, 1), ...project(-1, -1, 1));
}
