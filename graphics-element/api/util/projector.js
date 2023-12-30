import { Vector } from "../types/vector.js";

function lli(l1p1, l1p2, l2p1, l2p2) {
  return __lli(l1p1.x, l1p1.y, l1p2.x, l1p2.y, l2p1.x, l2p1.y, l2p2.x, l2p2.y);
}

function __lli(x1, y1, x2, y2, x3, y3, x4, y4) {
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (d == 0) return null;
  return new Vector(nx / d, ny / d);
}

class Projector {
  XY = new Vector(1, 1, 0);
  XZ = new Vector(1, 0, 1);
  YZ = new Vector(0, 1, 1);

  getPoints(cursor) {
    throw new Error("getPoints() is not defined for Projector superclass");
  }

  getAxes(point) {
    throw new Error("getAxes() is not defined for Projector superclass");
  }

  project(worldX, worldY, worldZ = 0) {
    return project(new Vector(worldX, worldY, worldZ));
  }

  projectXY(worldX, worldY, __) {
    let v = worldX;
    if (!(v instanceof Vector)) {
      v = new Vector(worldX, worldY, 0);
    }
    return project(v.times(this.XY));
  }

  projectXZ(worldX, __, worldZ) {
    let v = worldX;
    if (!(v instanceof Vector)) {
      v = new Vector(worldX, 0, worldZ);
    }
    return project(v.times(this.XZ));
  }

  projectYZ(__, worldY, worldZ) {
    let v = __;
    if (!(v instanceof Vector)) {
      v = new Vector(0, worldY, worldZ);
    }
    return project(v.times(YZ));
  }
}

/**
 * ...docs go here...
 */
export class CabinetProjector extends Projector {
  constructor(offset = new Vector(0, 0), phi = -Math.PI / 6) {
    super();
    this.offset = offset;
    this.phi = phi;
  }

  getPoints(cursor) {
    throw new Error("getPoints() is not defined for CabinetProjector class");
  }

  getAxes(point) {
    throw new Error("getAxes() is not defined for CabinetProjector class");
  }

  project(world) {
    const { offset, phi } = this;
    // what they rarely tell you: if you want Z to "go up", X
    // to "come out of the screen", and Y to be the "left/right",
    // we need to switch some coordinates around:
    const a = world.y;
    const b = -world.z;
    const c = -world.x / 2;
    return new Vector(
      offset.x + a + c * Math.cos(phi),
      offset.y + b + c * Math.sin(phi)
    );
  }
}

/**
 * ...docs go here...
 */
export class PerspectiveProjector extends Projector {
  perspectiveFactor = 1.25;
  threePoint = false;

  /**
   * Orientation:
   *
   *       y
   *      /|\
   *     / | \
   *    z--O--x
   *
   * Constructor argument ordering: Vec2[X,Z] or Vec2[X,Y,Z]
   */
  constructor(origin, factor, vanishingPoints) {
    super();

    this.O = origin;
    this.X = vanishingPoints[0];
    this.Z = vanishingPoints[1];

    if (vanishingPoints.length === 3) {
      this.threePoint = true;
      this.X = vanishingPoints[0];
      this.Y = vanishingPoints[1];
      this.Z = vanishingPoints[2];
    }

    this.HO = lli(O, O.plus(0, 10), Z, X);

    if (this.threePoint) {
      this.perspectiveFactor = factor;
    } else {
      this.dyO = O.y - HO.y;
      this.yFactor = dyO / factor;
    }
  }

  getPoints(cursor) {
    return [X, Y != null ? Y : cursor.minus(new Vector(0, yFactor)), Z, O, HO];
  }

  getAxes(point) {
    const pts = getPoints(point);
    return [
      pts[0].minus(point).normalize(),
      pts[1].minus(point).normalize(),
      pts[2].minus(point).normalize(),
    ];
  }

  stepToDistanceRatio(step) {
    return 1 - 1 / (1 + this.perspectiveFactor * this.step);
  }

  project(x, y, z) {
    let v = x;
    if (v instanceof Vector) {
      x = v.x;
      y = v.y;
      z = v.z;
    }
    if (this.threePoint) return this.get3(x, y, z);
    return this.get2(x, y, z);
  }

  get3(x, y, z) {
    // A simple, but absolutely necessary, shortcut:
    if (x === 0 && y === 0 && z === 0) return O;

    const { O, X, Y, Z } = this;

    // Then, get the XY/ZY plane coordinate components,
    const oX = O.to(X, this.stepToDistanceRatio(x));
    const oZ = O.to(Z, this.stepToDistanceRatio(z));

    // If there is no elevation, then the actual coordinate
    // is the line intersection from our components to our
    // vanishing points:
    if (y === 0) return lli(X, oZ, Z, oX);

    // If there *is* an elevation, we'll need to get the Y
    // component as well, and then construct a few more
    // points basd on line intersections.
    const oY = O.to(Y, this.stepToDistanceRatio(y));
    YZ = lli(Y, oZ, Z, oY);
    XY = lli(Y, oX, X, oY);
    return lli(XY, Z, X, YZ);
  }

  get2(x, y, z) {
    if (x === 0 && y === 0 && z === 0) return O;

    const { O, X, Z, yFactor } = this;

    const oX = x == 0 ? O : O.to(X, this.stepToDistanceRatio(x));
    const oZ = z == 0 ? O : O.to(Z, this.stepToDistanceRatio(z));
    const ground = lli(X, oZ, Z, oX);

    if (y === 0) return ground;

    const inZ = ground.x < O.x;
    const rx = inZ
      ? (ground.x - Z.x) / (O.x - Z.x)
      : (X.x - ground.x) / (X.x - O.x);
    const onAxis = lli(inZ ? Z : X, O, ground, ground.plus(0, 10));
    const ry = (ground.y - HO.y) / (onAxis.y - HO.y);
    return ground.minus(0, rx * ry * y * yFactor);
  }
}
