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

/**
 * Create a little airplane class that looks barely
 * like an airplane, but *acts* like one by having a
 * speed and turn rate that determine how fast it can
 * change heading when told to.
 */
class Airplane extends Circle {
  speed = 0.5;
  heading = -0.9;
  bank = 0;
  turnRate = (this.speed / 100) * 3.1415;

  // update the plane's position
  update({ x, y }) {
    const angle = atan2(y - this.y, x - this.x);
    this.setHeading(angle);
    const { speed, heading } = this;
    this.x += speed * cos(heading);
    this.y += speed * sin(heading);
  }

  // update the plane's heading based on a target point
  setHeading(target) {
    const { heading, turnRate } = this;
    let diff = (target - heading + TAU) % TAU;
    if (diff > PI) diff -= TAU;
    this.heading += constrain(diff, -turnRate, turnRate);
  }

  // draw a little "stick figure" airplane
  draw() {
    const { x, y, r, heading: a, bank, turnRate} = this;
    save();
    {
      translate(x, y);
      rotate(a);
      setColor(\`black\`);
      setLineWidth(3);
      line(-10, 0, 10, 0);
      line(-10,-5,-10, 5);
      const wingLength = map(abs(bank), 0, turnRate, 12, 10);
      save();
      {
        rotate(PI/2);
        line(0, 0, wingLength, 0);
        rotate(PI);
        line(0, 0, wingLength, 0);
      }
      restore();
      setColor(\`blue\`);
      setLineWidth(1);
      line(0,0,this.speed * 100,0);
    }
    restore();
  }

  // Determine where on the line p1--p2 this airplane should
  // be projected, based on the shorted projection distance.
  project(x1, y1, x2, y2) {
    const { x, y, r } = this;
    const dy = y2 - y1;
    const dx = x2 - x1;
    const c = new Point(this);

    const A = dy * dy + dx * dx;
    const B = 2 * (-c.x * dx - c.y * dy + x1 * dx + y1 * dy);
    const C =
      c.x * c.x +
      c.y * c.y +
      x1 * x1 +
      y1 * y1 -
      2 * c.x * x1 -
      2 * c.y * y1 -
      r * r;
    const D = B * B - 4 * A * C;

    const t1 = (-B + sqrt(D)) / (2 * A);
    const t2 = (-B - sqrt(D)) / (2 * A);

    if (isNaN(t1) && isNaN(t2)) {
      const cx = x - x1;
      const cy = y - y1;
      const f = constrain((dx * cx + dy * cy) / (dx * dx + dy * dy), 0, 1);
      return new Point(x1 + dx * f, y1 + dy * f);
    }

    if (isNaN(t1) || t1 < t2) t1 = t2;
    const t = constrain(t1, 0, 1);
    return new Point(x1 + dx * t, y1 + dy * t);
  }
}

let current = -1;
const points = [];
const trail = [];

/**
 * Our program entry point.
 */
function setup() {
  setSize(650, 500);
  addButton(\`play\`, (button) => {
    button.textContent = togglePlay() ? \`pause\` : \`play\`;
  });
  addButton(\`reset\`, (button) => {
    points.splice(0, points.length);
    trail.splice(0, trail.length);
    reset();
  });
  noGrid();
  airplane = new Airplane(100, 100, 40);
  addPoint(476, 100);
  addPoint(482, 425);
  addPoint(319, 264);
  addPoint(146, 393);
}

/**
 * The draw loop entry point.
 */
function draw() {
  clear(\`#FFEFB0\`);

  noFill();
  setStroke(\`lightgrey\`);
  plotData(points, \`x\`, \`y\`);

  setStroke(\`blue\`);
  plotData(trail, \`x\`, \`y\`);

  setStroke(\`black\`);
  points.forEach((p) => point(p.x, p.y));

  // figure out where to fly to
  const target = getTarget();
  if (target) {
    setStroke(\`green\`);
    line(airplane.x, airplane.y, target.x, target.y);
    setStroke(\`black\`);
    if (playing) airplane.update(target);
  }

  trail.push(new Point(airplane.x, airplane.y));

  noFill();
  setStroke(\`black\`);
  airplane.draw();
}

/**
 * The meat and potatoes, where we can experiment with targeting algorithms.
 * At its most basic, though (for demo purposes) we just target "the next point".
 */
function getTarget() {
  if (current < 0) return;

  let target = points[current];
  if (!target) return;

  if (dist(airplane.x, airplane.y, target.x, target.y) < airplane.r / 10) {
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
  if (current === -1 && points.length === 1) {
    current = 0;
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
