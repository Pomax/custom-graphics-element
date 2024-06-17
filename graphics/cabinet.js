function setup() {
  setSize(600, 400);
  setBorder(1, `black`);
  setGrid(20, `grey`);
  setProjector(CABINET);
  scaleProjector(50);
  play();
}

function draw() {
  setCursor(`none`);
  clear(`white`);
  center();
  rotateProjector(millis() / 3000, 0, 0);
  drawAxes();
  drawBox();
}

function drawAxes() {
  const axelen = huge / 10;
  setColor(`darkred`);
  line(-axelen, 0, 0, axelen, 0, 0);
  setColor(`darkblue`);
  line(0, 0, -axelen, 0, 0, axelen);
  setColor(`darkgreen`);
  line(0, -axelen, 0, 0, axelen, 0);
}

function drawBox() {
  // The four "x-axis aligned" edges
  setColor(`red`);
  line(-1, -1, -1, 1, -1, -1);
  line(-1, -1, 1, 1, -1, 1);
  line(-1, 1, -1, 1, 1, -1);
  line(-1, 1, 1, 1, 1, 1);

  // The four "z-axis aligned" edges
  setColor(`blue`);
  line(-1, -1, -1, -1, -1, 1);
  line(-1, 1, -1, -1, 1, 1);
  line(1, -1, -1, 1, -1, 1);
  line(1, 1, -1, 1, 1, 1);

  // The four "y-axis aligned" edges
  setColor(`green`);
  line(1, 1, -1, 1, -1, -1);
  line(1, 1, 1, 1, -1, 1);
  line(-1, 1, -1, -1, -1, -1);
  line(-1, 1, 1, -1, -1, 1);
}
