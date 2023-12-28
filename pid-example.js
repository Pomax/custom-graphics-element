import { PID } from "./pid.js";

const F = 1;
const target = 100;

/**
 * The master setup function
 */
function setup() {
  setSize(500, 300);
  addSlider(`kp`, { step: 0.001, value: 0.5 });
  addSlider(`ki`, { min: -1, max: 1, step: 0.001, value: 0 });
  addSlider(`kd`, { max: 20, step: 0.01, value: 0 });
}

/**
 * The master draw function
 */
function draw() {
  clear();

  const f = 2;
  const h = height / f;

  // our zero axis
  setStroke(`black`);
  line(0, h, width, h);

  // our target
  setStroke(`blue`);
  line(0, height - (h + target / f), width, height - (h + target / f));

  const data = generatePIDcurve();

  // input curve
  noFill();
  setStroke(`red`);
  start();
  data.forEach(([x, y]) => vertex(x / F, height - (h + y / f)));
  end();

  // output curve
  noFill();
  setStroke(`green`);
  start();
  data.forEach(([x, _, y]) => vertex(x / F, height - (h + y / f)));
  end();
}

/**
 * Generate a PID run so we can view its control curve.
 * @returns
 */
function generatePIDcurve() {
  const pid = new PID(kp, ki, kd);
  const v = new Vector(0, 0, 0);
  v.update = (u) => {
    v.y += u / 100;
    v.x = v.x + v.y;
  };

  let min = 0;
  let max = 0;
  const data = [];
  for (let i = 0; i < F * width; i++) {
    const output = pid.getRecommendation(v.x, target);
    v.update(output);
    if (min > v.x) min = v.x;
    if (max < v.x) max = v.x;
    data.push([i, v.x, output]);
  }
  data.min = min;
  data.max = max;
  return data;
}
