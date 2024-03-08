/**
 * code used by project.js, but named so that it loads
 * first, and does not get added to the d.ts file.
 */
class CabinetProjector {
  α = 0;
  β = 0;
  γ = 0;

  constructor(ox, oy, scale, phi) {
    this.update(ox, oy, scale, phi);
  }

  setRotation(x = 0, y = 0, z = 0) {
    this.α = x;
    this.β = z;
    this.γ = y;
  }

  rotate(x, y, z) {
    let { α, β, γ } = this;
    let a = x;
    let b = y * cos(α) - z * sin(α);
    let c = y * sin(α) + z * cos(α);
    x = a;
    y = b;
    z = c;
    a = x * cos(β) + z * sin(β);
    b = y;
    c = x * -sin(β) + z * cos(β);
    x = a;
    y = b;
    z = c;
    a = x * cos(γ) - y * sin(γ);
    b = x * sin(γ) + y * cos(γ);
    c = z;

    return [a, b, c];
  }

  update(ox = 0, oy = 0, scale = 1, phi = -PI / 6) {
    this.offset = new Point(ox, oy);
    this.scale = scale;
    this.phi = phi;
  }

  project(x, y, z) {
    const { offset, scale, phi } = this;
    x *= scale;
    y *= scale;
    z *= scale;
    [x, y, z] = this.rotate(x, y, z);
    const a = y,
      b = -z,
      c = -x / 2;

    return [offset.x + a + c * cos(phi), offset.y + b + c * sin(phi)];
  }
}

let __projector = new CabinetProjector();
