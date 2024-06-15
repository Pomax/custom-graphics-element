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

    return new Point(offset.x + a + c * cos(phi), offset.y + b + c * sin(phi));
  }
}

/**
 * TEST
 */
class HomogeneousProjector {
  Z = 0; // yaw
  Y = 0; // pitch
  X = 0; // roll
  d = Infinity; // "infinity lies at distance: ..."
  Tx = 0;
  Ty = 0;
  Tz = 0;
  Sx = 1;
  Sy = 1;
  Sz = 1;

  constructor(d = Infinity) {
    this.setInfinity(d);
  }

  setInfinity(d) {
    this.d = d;
  }

  setRotation(x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  }

  setTranslation(x = 0, y = 0, z = 0) {
    this.Tx = x;
    this.Ty = y;
    this.Tz = z;
  }

  setScale(x = 1, y = 1, z = 1) {
    this.Sx = x;
    this.Sy = y;
    this.Sz = z;
  }

  project(x, y, z) {
    const [Vx, Vy, Vz] = [x, y, z];
    const { X, Y, Z, d, Tx, Ty, Tz, Sx, Sy, Sz } = this;
    const cy = cos(Z);
    const sy = sin(Z);
    const cp = cos(Y);
    const sp = sin(Y);
    const cr = cos(X);
    const sr = sin(X);

    // prettier-ignore
    // homogenous affine transform matrix
    const M = [
       Sx * cp * cy, Sx * (cy * sp * sr - cr * sy), Sx * (cr * cy * sp + sr * sy), Tx,
       Sy * cp * sy, Sy * (cr * cy + sp * sr * sy), Sy * (cr * sp * sy - cy * sr), Ty,
      -Sz * sp,      Sz * cp * sr,                  Sz * cp * cr,                  Tz,
       sp / d,      -cp * sr / d,                  -cp * cr / d,                    1,
    ];

    // prettier-ignore
    // homogeneous transformed input vector
    const [px, py, _pz, w] = [
      Vx * M[ 0] + Vy * M[ 1] + Vz * M[ 2] + M[ 3],
      Vx * M[ 4] + Vy * M[ 5] + Vz * M[ 6] + M[ 7],
0, // Vx * M[ 8] + Vy * M[ 9] + Vz * M[10] + M[11], // we don't actually use z
      Vx * M[12] + Vy * M[13] + Vz * M[14] + M[15],
    ]

    // screen coordinate
    return new Point(px / w, py / w);
  }
}

let __projector = new CabinetProjector();
let __hProjector = new HomogeneousProjector(250);
