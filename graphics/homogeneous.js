function getDescription() {
  return `3D perspective projection using 4D homogeneous transform matrix multiplication.`;
}

function setup() {
  setSize(600, 400);
  setBorder(1, `black`);
  setGrid(20, `grey`);
  setProjector(HOMOGENEOUS).setInfinity(250);
  play();
}

function draw() {
  clear(`#333`);
  randomSeed(3);
  center();
  rotateProjector(frame / 100, frame / 150, frame / 200);
  drawCube(75 + 25 * sin(frame / 100));
}

function drawCube(s) {
  const top = [
    [-s, s, s],
    [-s, -s, s],
    [s, -s, s],
    [s, s, s],
  ];
  const bottom = [
    [-s, s, -s],
    [-s, -s, -s],
    [s, -s, -s],
    [s, s, -s],
  ];
  const cube = [bottom, top];
  cube.forEach((pts) => {
    setColor(randomColor());
    pts.forEach((p, i) => {
      point(...p);
      const q = pts[(i + 1) % pts.length];
      line(...p, ...q);
    });
  });
  setColor(randomColor());
  range(0, top.length, 1, (i) => line(...cube[0][i], ...cube[1][i]));
}
