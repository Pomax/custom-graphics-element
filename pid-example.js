/**
 * The JS code for a PID controller.
 */
class PID {
  constructor(p, i, d, maxErrorTerms = 50) {
    this.kp = p;
    this.ki = i;
    this.kd = d;
    this.maxErrorTerms = maxErrorTerms;
    this.I = 0;
    this.lastError = false;
    this.errors = [];
  }

  getRecommendation(current, target) {
    const { kp, ki, kd, errors, maxErrorTerms } = this;
    const error = target - current;
    const P = kp * error;
    errors.push(error);
    while (errors.length > maxErrorTerms) errors.shift();
    const I = (ki * errors.reduce((t, e) => t + e, 0)) / errors.length;
    const D = (this.lastError ? kd : 0) * (error - this.lastError);
    this.lastError = error;
    return P + I + D;
  }
}

/**
 * The master setup function
 */
function setup() {
  addSlider(`kp`, { step: 0.001, value: 0.5 });
  addSlider(`ki`, { min: -1, max: 1, step: 0.001, value: 0 });
  addSlider(`kd`, { max: 20, step: 0.01, value: 0 });
  noGrid();
}

/**
 * The master draw function
 */
function draw() {
  clear();

  translate(30, 60);

  // our zero axis
  setColor(`black`);
  axes(`x`, 0, width, `y`, 0, height);

  // Generate a PID run's worth of data:
  const data = generatePIDcurve();

  // draw our target value
  noFill();
  setStroke(`blue`);
  plotData(data, 0, 2);

  // draw our PID input curve
  setStroke(`red`);
  plotData(data, 0, 1);

  // draw our PID output curve
  setStroke(`green`);
  plotData(data, 0, 3);
}

/**
 * Generate a PID run so we can view its control curve.
 * @returns
 */
function generatePIDcurve() {
  // In order to get realistic behaviour, we use a vector in which
  // the .x value is "our real value", and the .y value is our current
  // inertia. Think of our vector being a car, the .x being its position
  // and the .y being it's speed: if we want to put it at a specific
  // location, the only thing we can change is its speed.
  const v = new Vector(0, 0, 0);
  v.update = (u) => {
    // we can only "speed up" or "slow down" so much per time unit.
    v.y += map(u, -100, 100, -1, 1, CONSTRAIN);
    v.x += v.y;
  };

  // Set up a new PID controller...
  const pid = new PID(kp, ki, kd);

  // Then run a feedback loop using that PID controller for
  // as many iterations as our graphic is pixels wide.
  const data = [];
  for (let t = 0; t < width; t++) {
    // We target zero first, and then after 50 iterations flip it to 100
    const target = t < 50 ? 0 : 100;
    const output = pid.getRecommendation(v.x, target);
    v.update(output);
    data.push([t, v.x, target, output]);
  }
  return data;
}
