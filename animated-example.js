let a = 0;

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  const playButton = find(`button`);
  playButton.addEventListener(`click`, ({ target }) => {
    target.textContent = togglePlay() ? `pause` : `play`;
  });
  this.canvas.addEventListener(`click`, () => playButton.click());
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

  const x = w + 100 * cos(a);
  const y = h + 100 * sin(a);
  const sec = 100 / cos(a);
  const cosec = 100 / sin(a);

  setFill(`#F006`);
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

  a += 0.002;
}
