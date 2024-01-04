// we're going to animate this graphic by varying an angle.
let a = Math.PI / 2 + 0.0001;
const radius = 100;
let playButton;

/**
 * The main setup function
 */
function setup() {
  setSize(780, 300);
  playButton = addButton(`play`, (button) => {
    button.textContent = togglePlay() ? `pause` : `play`;
  });
}

/**
 * The main draw function
 */
function draw() {
  clear();

  // If we're running animated, draw "playing" in the upper left corner.
  setLineWidth(1);
  if (playing) {
    setFill(`black`);
    text(`playing...`, 10.5, 10.5);
  }

  // Then, draw a unit circle and cross axes,
  noFill();
  setStroke(`black`);
  const w = width / 2;
  const h = height / 2;
  circle(w, h, radius);
  line(0, h, width, h);
  line(w, 0, w, height);

  // Then draw the trig identities twice, as mirrors of each other
  [a, a + PI].forEach((angle) => {
    renderIdentities(w, h, angle, true);
    renderIdentities(w, h, angle, false);
  });

  // add a quarter turn every 3 seconds
  if (playing && frameDelta < 50) {
    a += (PI / 2) * (frameDelta / 3000);
  }

  // Then, if we're *not* playing, draw a "play" overlay:
  if (!playing) {
    setFill(`#FFF9`);
    rect(0, 0, width, height);
    setStroke(`white`);
    setFill(`black`);
    triangle(w - 20, h - 30, w - 20, h + 30, w + 40, h);
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

  // figure out where our point-on-the-unit-circle is
  const x = w + radius * cos(a);
  const y = h + radius * sin(a);

  const secant = radius * sec(a);
  const cosecant = radius * csc(a);

  setFill(`#55F3`);
  noStroke();
  start();
  vertex(w + secant, h);
  vertex(w, h);
  vertex(w, h + cosecant);
  end(true);

  setStroke(`red`);
  line(x, y, x, h);

  setStroke(`green`);
  line(x, y, w, y);

  setStroke(`orange`);
  line(x, y, w + secant, h);

  setStroke(`purple`);
  line(x, y, w, h + cosecant);

  setStroke(`blue`);
  line(w, h, w + sec, h);

  setStroke(`gold`);
  line(x, y, w + secant, h);

  setStroke(`black`);
  line(w, h, x, y);

  setFill(`red`);
  circle(x, y, 3);
}

function pointerDown() {
  playButton.textContent = togglePlay() ? `pause` : `play`;
}
