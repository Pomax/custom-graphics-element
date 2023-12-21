let a = 0;

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  const playButton = find(`button`);
  [`click`, `touchstart`].forEach((evtName) => {
    playButton.addEventListener(
      evtName,
      (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.textContent = togglePlay() ? `pause` : `play`;
      },
      { passive: false }
    );
    this.canvas.addEventListener(evtName, () => playButton.click());
  });
}

/**
 * The master draw function
 */
function draw() {
  const { width, height } = this;
  clear();
  setWidth(1);
  if (this.playing) {
    setFill(`black`);
    text(`playing...`, 10.5, 10.5);
  }

  noFill();
  setStroke(`black`);
  const w = width / 2;
  const h = height / 2;
  circle(w, h, 100);
  line(0, h, width, h);
  line(w, 0, w, height);
  [a, a + PI].forEach((angle) => {
    renderIdentities(w, h, angle, true);
    renderIdentities(w, h, angle, false);
  });
  a += 0.002;
}

function renderIdentities(w, h, a, flipped) {
  if (flipped) a = PI - a;

  const x = w + 100 * cos(a);
  const y = h + 100 * sin(a);
  const sec = 100 / cos(a);
  const cosec = 100 / sin(a);

  setFill(`#55F3`);
  noStroke();
  start();
  vertex(0, 0);
  vertex(w + sec, h);
  vertex(w, h);
  vertex(w, h + cosec);
  end(true);

  setStroke(`black`);
  line(w, h, x, y);

  setWidth(2);
  setFill(`red`);
  circle(x, y, 3);
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
}
