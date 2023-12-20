const F = 1;
const { abs } = Math;

const target = 100;

function constrain(v, a, b) {
  return v < a ? a : v > b ? b : v;
}

class PID {
  constructor(p, i, d, maxErrors = 50) {
    this.kp = p;
    this.ki = i;
    this.kd = d;
    this.I = 0;
    this.lastError = false;
    this.errors = [];
    this.maxErrors = maxErrors;
  }

  getRecommendation(current, target) {
    if (this.lastError === false) {
      this.lastError = current;
    }
    const { kp, ki, kd, errors, maxErrors } = this;
    const error = target - current;
    const akp = error / 10 < 1 ? (error / 10) ** 2 : 1;
    const P = kp * akp * error;
    errors.push(error);
    const I = (ki * errors.reduce((t, e) => t + e, 0)) / errors.length;
    const D = kd * (error - this.lastError);
    this.lastError = error;
    while (errors.length > maxErrors) errors.shift();
    return P + I + D;
  }
}

const graphics = {
  /**
   *the master setup function
   */
  setup() {
    addSlider(`.slide-control`, `maxErrors`, 1, 1000, 1, 100);
    addSlider(`.slide-control`, `kp`, 0, 0.5, 0.001, 0.05);
    addSlider(`.slide-control`, `ki`, -0.3, 0.3, 0.001, -0.03);
    addSlider(`.slide-control`, `kd`, 0, 20, 0.01, 10);
  },

  /**
   * The master draw function
   */
  draw() {
    clear();

    const { width, height } = this;
    const f = 2;
    const h = height / f;

    // our zero axis
    this.setStroke(`black`);
    this.line(0, h, width, h);

    // our target
    this.setStroke(`blue`);
    this.line(0, height - (h + target / f), width, height - (h + target / f));

    const data = this.generatePIDcurve();

    // input curve
    this.noFill();
    this.setStroke(`red`);
    this.start();
    data.forEach(([x, y]) => this.vertex(x / F, height - (h + y / f)));
    this.end();

    // output curve
    this.noFill();
    this.setStroke(`green`);
    this.start();
    data.forEach(([x, _, y]) => this.vertex(x / F, height - (h + y / f)));
    this.end();
  },

  generatePIDcurve() {
    const { kp, ki, kd, maxErrors } = this;
    const pid = new PID(kp, ki, kd, maxErrors);
    const v = new Vector(0, 0, 0);

    const update = (u) => {
      // use .y as inertial force
      if (target - v.x < 10 && u < 0) {
        v.y += u / 100;
      } else if (v.x - target < 10 && u < 0) {
        v.y += u / 100;
      } else {
        v.y += u / 100;
      }
      v.x = v.x + v.y;
    };

    let min = 0,
      max = 0;
    const data = [];
    for (let i = 0; i < F * this.width; i++) {
      const softTarget =
        abs(target - v.x) < 20 ? target : v.x < target ? v.x + 20 : v.x - 20;
      const output = pid.getRecommendation(v.x, softTarget);
      update(output);
      if (min > v.x) min = v.x;
      if (max < v.x) max = v.x;
      data.push([i, v.x, output]);
    }
    data.min = min;
    data.max = max;
    return data;
  },
};
