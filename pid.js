export class PID {
  constructor(p, i, d, maxErrors = 50) {
    this.kp = p;
    this.ki = i;
    this.kd = d;
    this.maxErrors = maxErrors;
    this.I = 0;
    this.lastError = false;
    this.errors = [];
  }

  getRecommendation(current, target) {
    if (this.lastError === false) this.lastError = current;
    const { kp, ki, kd, errors, maxErrors } = this;
    const error = target - current;
    const P = kp * error;
    errors.push(error);
    while (errors.length > maxErrors) errors.shift();
    const I = (ki * errors.reduce((t, e) => t + e, 0)) / errors.length;
    const D = kd * (error - this.lastError);
    this.lastError = error;
    return P + I + D;
  }
}
