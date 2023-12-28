let a = Math.PI / 2 + 0.01;
const radius = 100;

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  const playButton = find(`button`);
  playButton.addEventListener(
    `click`,
    (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      evt.target.textContent = togglePlay() ? `pause` : `play`;
    },
    { passive: false }
  );
}

/**
 * The master draw function
 */
function draw() {
  clear();
  setLineWidth(1);
  if (__playing) {
    setFill(`black`);
    text(`playing...`, 10.5, 10.5);
  }

  noFill();
  setStroke(`black`);
  const w = width / 2;
  const h = height / 2;
  circle(w, h, radius);
  line(0, h, width, h);
  line(w, 0, w, height);
  [a, a + PI].forEach((angle) => {
    renderIdentities(w, h, angle, true);
    renderIdentities(w, h, angle, false);
  });
  a += 0.002;

  // "play" overlay
  if (!__playing) {
    setFill(`#0002`);
    rect(0, 0, width, height);
    setStroke(`white`);
    setFill(`black`);
    triangle(w - 30, h - 30, w - 30, h + 30, w + 30, h);
  }
}

/**
 * Let's do some trigonometry!
 * @param {*} w the graphics' center x
 * @param {*} h the graphics' center y
 * @param {*} a the angle at which we're going to do some trig
 * @param {*} flipped
 */
function renderIdentities(w, h, a, flipped) {
  if (flipped) a = PI - a;

  const x = w + radius * cos(a);
  const y = h + radius * sin(a);
  const sec = radius / cos(a);
  const cosec = radius / sin(a);

  setFill(`#55F3`);
  noStroke();
  start();
  vertex(w + sec, h);
  vertex(w, h);
  vertex(w, h + cosec);
  end(true);

  setLineWidth(2);
  setStroke(`red`);
  line(x, y, x, h);
  setStroke(`green`);
  line(x, y, w, y);

  setStroke(`orange`);
  line(x, y, w + sec, h);
  setStroke(`purple`);
  line(x, y, w, h + cosec);

  setStroke(`blue`);
  line(w, h, w + sec, h);
  setStroke(`gold`);
  line(w, h, w, h + cosec);

  setStroke(`black`);
  line(w, h, x, y);
  setFill(`red`);
  circle(x, y, 3);
}

function pointerDown() {
  togglePlay();
}
