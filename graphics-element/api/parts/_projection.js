const __ABSTRACT_PROJECTOR = Symbol(`abstract projector superclass`);

// Generic projector superclass
class Projector {
  // axial angles of rotation
  X = 0;
  Y = 0;
  Z = 0;

  // "infinity lies at distance: ..."
  infinity = Infinity;

  type = __ABSTRACT_PROJECTOR;

  setInfinity() {
    // does nothing by default
  }

  setRotation(x = 0, y = 0, z = 0) {
    this.X = x;
    this.Z = z;
    this.Y = y;
  }

  Tx = 0;
  Ty = 0;
  Tz = 0;

  setTranslation(x = 0, y = 0, z = 0) {
    this.Tx = x;
    this.Tz = z;
    this.Ty = y;
  }

  Sx = 1;
  Sy = 1;
  Sz = 1;

  setScale(x = 1, y, z) {
    if (x && !y && !z) {
      z = y = x;
    }
    this.Sx = x;
    this.Sz = z;
    this.Sy = y;
  }

  project(x, y, z) {
    throw new Error(`Missing implementation for project(x,y,z)!`);
  }
}

/**
 * code used by project.js, but named so that it loads
 * first, and does not get added to the d.ts file.
 */
class CabinetProjector extends Projector {
  type = CABINET;
  phi = -PI / 6;

  setPhi(phi) {
    this.phi = phi;
  }

  project(x, y, z) {
    const { X, Y, Z, Tx, Ty, Sx, Sy, Sz, phi } = this;
    [x, y, z] = this.rotate(X, Y, Z, x * Sx, y * Sy, z * Sz);
    const a = y;
    const b = -z;
    const c = -x / 2;
    return new Point(Tx + a + c * cos(phi), Ty + b + c * sin(phi));
  }

  rotate(X, Y, Z, x, y, z) {
    let [A, B, C] = [-X, -Y, Z];
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
}

/**
 * code used by project.js, but named so that it loads
 * first, and does not get added to the d.ts file.
 */
class HomogeneousProjector extends Projector {
  type = HOMOGENEOUS;

  // effect a default projection similar (enough) to
  // the default cabinet projection
  constructor() {
    super();
    this.setInfinity(200);
    this.setRotation(0, 0, -0.35);
  }

  setInfinity(d) {
    this.infinity = d;
  }

  project(x, y, z) {
    const { X, Y, Z, infinity: d, Tx, Ty, Tz, Sx, Sy, Sz } = this;
    const [Vx, Vy, Vz] = [(y - Ty) * Sy, (-z - Tz) * Sz, (x - Tx) * Sx];
    const [A, B, C] = [X, Z, Y];

    const cy = cos(A);
    const sy = sin(A);
    const cp = cos(B);
    const sp = sin(B);
    const cr = cos(C);
    const sr = sin(C);

    // prettier-ignore
    // homogenous affine transform matrix
    const M = [
       cp * cy, (cy * sp * sr - cr * sy), (cr * cy * sp + sr * sy), 0,
       cp * sy, (cr * cy + sp * sr * sy), (cr * sp * sy - cy * sr), 0,
      -sp,      cp * sr,                  cp * cr,                  0,
       sp / d, -cp * sr / d,             -cp * cr / d,              1,
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
