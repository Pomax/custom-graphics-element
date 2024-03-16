/**
 * code used by project.js, but named so that it loads
 * first, and does not get added to the d.ts file.
 */
class CabinetProjector {
  A = 0;
  B = 0;
  C = 0;

  constructor(ox, oy, scale, phi) {
    this.update(ox, oy, scale, phi);
  }

  setRotation(x = 0, y = 0, z = 0) {
    this.A = x;
    this.B = z;
    this.C = y;
  }

  rotate(x, y, z) {
    let { A, B, C } = this;
    let a = x;
    let b = y * cos(A) - z * sin(A);
    let c = y * sin(A) + z * cos(A);
    x = a;
    y = b;
    z = c;
    a = x * cos(B) + z * sin(B);
    b = y;
    c = x * -sin(B) + z * cos(B);
    x = a;
    y = b;
    z = c;
    a = x * cos(C) - y * sin(C);
    b = x * sin(C) + y * cos(C);
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

    return new Point(
      offset.x + a + c * cos(phi),
      offset.y + b + c * sin(phi)
    );
  }
}

let __projector = new CabinetProjector();
