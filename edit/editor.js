function waitFor(check) {
  return new Promise((resolve, reject) => {
    (function test() {
      try {
        if (check()) return resolve();
      } catch (e) {
        return reject(e);
      }
      setTimeout(test, 200);
    })();
  });
}

console.log(`wait for graphics-element...`);
await customElements.whenDefined(`graphics-element`);
const graphics = document.querySelector(`graphics-element`);

const demoCode = `let airplane;
let current = -1;
const points = [];
const trail = [];

/**
 * Our program entry point.
 */
function setup() {
  setSize(650, 500);
  addButton(`play`, (button) => {
    button.textContent = togglePlay() ? `pause` : `play`;
  });
  addButton(`reset`, () => {
    points.splice(0, points.length);
    trail.splice(0, trail.length);
    reset();
  });
  addSlider(`insideTarget`, { min: 1 / 6, max: 1, step: 1 / 6, value: 4 / 6 });
  noGrid();

  // Set up an "airplane" and a few points that define its flight path:
  airplane = new Airplane(100, 100, 40);
  addPoint(100, 200);
  addPoint(476, 100);
  addPoint(482, 425);
  addPoint(319, 264);
  addPoint(146, 393);
  current = 0;
}

/**
 * The draw loop entry point.
 */
function draw() {
  clear(`#FFEFB0`);

  noFill();

  // Draw the flight path
  setStroke(`lightgrey`);
  plotData(points, `x`, `y`);

  // And the "where we've been so far" trail
  setStroke(`blue`);
  plotData(trail, `x`, `y`);

  // And then draw each of the path points on top.
  setStroke(`black`);
  points.forEach((p) => point(p.x, p.y));

  // Then: figure out which heading to fly our plane:
  const target = getTarget(airplane);
  if (target) {
    // Show the target we want to head towards
    setColor(`magenta`);
    line(airplane.x, airplane.y, target.x, target.y);
    circle(target.x, target.y, 3);
    setStroke(`black`);
    if (playing) airplane.update(target);
  }

  // Update our "where we've been" array...
  trail.push(new Point(airplane.x, airplane.y));

  // And then finally, draw the airplane in its current location
  noFill();
  setStroke(`black`);
  airplane.draw();
}

/**
 * The meat and potatoes, where we can experiment with targeting algorithms.
 * At its most basic, though (for demo purposes) we just target "the next point".
 */
function getTarget(airplane) {
  if (current < 0) return;

  let target, p1, p2, p3, i23;

  p1 = points[current];
  if (!p1) return;

  // Are we flying "a leg"?
  p2 = points[current + 1];
  if (!p2) return;
  // If so, target the leg's flightpath
  target = airplane.project(p1.x, p1.y, p2.x, p2.y, insideTarget * airplane.r);

  // But let's also check whether we're close enough to the
  // next leg, if there is one, that we need to transition.
  p3 = points[current + 2];
  if (p3) {
    i23 = airplane.project(p2.x, p2.y, p3.x, p3.y);
    if (i23) {
      // show this point
      setColor(`red`);
      point(i23.x, i23.y);
      setLineDash(4);
      line(airplane.x, airplane.y, i23.x, i23.y);
      noLineDash();
      if (dist(airplane.x, airplane.y, i23.x, i23.y) < airplane.r) {
        // swapsies~
        current++;
        target = i23;
      }
    }
  }

  // There is no "next leg", so we simply transition
  // once we reach the end of the current one.
  else if (dist(airplane.x, airplane.y, p2.x, p2.y) < airplane.r) {
    current++;
  }

  return target;
}

/**
 * If we click on the graphic, place a new point.
 */
function pointerDown(x, y) {
  addPoint(x, y);
  redraw();
}

/**
 * Adding a point also means checking to see if
 * we now "have points at all". If so, we mark
 * the first point as our current target.
 */
function addPoint(x, y) {
  if (currentPoint) return;
  const p = new Point(x, y);
  setMovable(p);
  points.push(p);
}

/**
 * Create a little airplane class that looks barely
 * like an airplane, but *acts* like one by having a
 * speed and turn rate that determine how fast it can
 * change heading when told to.
 */
class Airplane extends Circle {
  speed = 50;
  heading = -0.9;
  bank = 0;
  turnRate = radians(0.5);

  // update the plane's position
  update({ x, y }) {
    if (frameDelta > 50) return;
    const timeInSeconds = frameDelta / 1000;
    const angle = atan2(y - this.y, x - this.x);
    this.setHeading(angle, timeInSeconds);
    const { speed, heading } = this;
    this.x += speed * timeInSeconds * cos(heading);
    this.y += speed * timeInSeconds * sin(heading);
  }

  // update the plane's heading based on a target point
  setHeading(target, timeInSeconds) {
    const { heading, turnRate } = this;
    let diff = (target - heading + TAU) % TAU;
    if (diff > PI) diff -= TAU;
    diff /= timeInSeconds;
    this.heading += constrain(diff, -turnRate, turnRate);
  }

  // draw a little "stick figure" airplane
  draw() {
    const { x, y, r, heading: a, bank, turnRate } = this;
    noFill();
    setStroke(`black`);
    circle(x, y, r);
    // by far the easiest way to draw a little stick figure
    // is to change the coordinate system instead of trying
    // to rotated every individual line, so: save the current
    // drawing context, and then change things:
    save();
    {
      translate(x, y);
      rotate(a);
      setColor(`black`);
      setLineWidth(3);
      line(-10, 0, 10, 0);
      line(-10, -5, -10, 5);
      const wingLength = map(abs(bank), 0, turnRate, 12, 10);
      save();
      {
        rotate(PI / 2);
        line(0, 0, wingLength, 0);
        rotate(PI);
        line(0, 0, wingLength, 0);
      }
      restore();
      setColor(`blue`);
      setLineWidth(1);
      line(0, 0, this.speed, 0);
    }
    // And once we're done, we restore the grahpics context
    // to what it was before we started drawing:
    restore();
  }

  // Determine where on the line p1--p2 this airplane should
  // be projected, based on the shorted projection distance.
  project(x1, y1, x2, y2, r = this.r) {
    const { x, y } = this;
    const dx = x2 - x1;
    const dy = y2 - y1;

    const A = dy ** 2 + dx ** 2;
    const B = 2 * (-x * dx - y * dy + x1 * dx + y1 * dy);
    const C =
      x ** 2 +
      y ** 2 +
      x1 ** 2 +
      y1 ** 2 -
      2 * x * x1 -
      2 * y * y1 -
      r ** 2;
    const D = B * B - 4 * A * C;

    const t1 = (-B + sqrt(D)) / (2 * A);
    const t2 = (-B - sqrt(D)) / (2 * A);


    if (isNaN(t1) && isNaN(t2)) {
      // If we're too far from p1--p2, compute the
      // direct projection instead:
      const acx = x - x1;
      const acy = y - y1;
      const f = (dx * acx + dy * acy) / (dx ** 2 + dy ** 2);
      const t = constrain(f, 0, 1);
      const p = new Point(x1 + dx * t, y1 + dy * t);
      return p;
    }

    if (isNaN(t1) || t1 < t2) t1 = t2;

    const t = constrain(t1, 0, 1);
    return { x: x1 + dx * t, y: y1 + dy * t };
  }
}
`;
const savedCode = localStorage.getItem(`code`) || demoCode;

console.log(`wait for monaco...`);
await waitFor(() => typeof monaco !== `undefined`);
console.log(`good to go.`);

// Build the "VS Code" editor instance, without the VS Code parts.
const editor = monaco.editor.create(document.getElementById(`editor`), {
  value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
  language: "javascript",
  automaticLayout: true,
});

// let's keep code nice and concise.
editor.getModel().updateOptions({
  detectIndentation: true,
  insertSpaces: true,
  tabSize: 2,
});

// Add update debouncing, so we don't refresh on every keystroke.
let runUpdate = -1;
editor.onDidChangeModelContent(({ changes }) => {
  // console.log(changes);
  const editorCode = editor.getValue();
  clearTimeout(runUpdate);
  runUpdate = setTimeout(() => {
    localStorage.setItem(`code`, editorCode);
    graphics.reset(editorCode);
  }, 500);
});

// And show either the demo code, or the localStorage stored code.
await waitFor(() => typeof graphics.loadSource === `function`);
graphics.loadSource(savedCode);
editor.setValue(savedCode);
