import { Point } from "./point.js";

function compute(t, a, b, c, d) {
  let mt = 1 - t,
    t2 = t * t,
    t3 = t2 * t,
    mt2 = mt * mt,
    mt3 = mt2 * mt;
  return a * mt3 + 3 * b * mt2 * t + 3 * c * mt * t2 + d * t3;
}

/**
 * A canvas-aware Bezier curve class
 */
class Bezier {
  constructor(...coords) {
    if (coords.length === 8) {
      this.points = [
        new Point(coords[0], coords[1]),
        new Point(coords[2], coords[3]),
        new Point(coords[4], coords[5]),
        new Point(coords[6], coords[7]),
      ];
    }
    this.update();
  }

  update() {
    this.buildLUT(25);
  }

  buildLUT(n) {
    this.lut = [];
    for (let i = 0; i <= n; i++) {
      this.lut[i] = this.get(i / n);
    }
  }

  get(t) {
    let p = this.points;
    return new Point(
      compute(t, p[0].x, p[1].x, p[2].x, p[3].x),
      compute(t, p[0].y, p[1].y, p[2].y, p[3].y)
    );
  }

  getPointNear(x, y, d = 5) {
    const p = this.points;
    for (let i = 0, e = p.length; i < e; i++) {
      let dx = Math.abs(p[i].x - x);
      let dy = Math.abs(p[i].y - y);
      if ((dx * dx + dy * dy) ** 0.5 <= d) {
        return p[i];
      }
    }
  }

  getProjectionPoint(x, y) {
    // project this point onto the curve and return _that_ point
    const n = this.lut.length - 1,
      p = this.points;

    let d,
      closest,
      smallestDistance = Number.MAX_SAFE_INTEGER;

    // coarse check
    this.lut.forEach((p, i) => {
      d = p.dist(x, y);
      if (d < smallestDistance) {
        smallestDistance = d;
        p.t = i/n;
        closest = p;
      }
    });

    // fine check
    for (let o = -0.1, t, np; o<=0.1; o+=0.01) {
      t = closest.t + o;
      if (t<0) continue;
      if (t>1) continue;
      np = new Point(
        compute(closest.t + o, p[0].x, p[1].x, p[2].x, p[3].x),
        compute(closest.t + o, p[0].y, p[1].y, p[2].y, p[3].y)
      );
      d = np.dist(x, y);
      if (d < smallestDistance) {
        smallestDistance = d;
        closest = np;
      }
    }

    return closest;
  }

  draw(ctx) {
    this.drawSkeleton(ctx);
    const p = this.points;
    const w = ctx.lineWidth;
    ctx.lineWidth = 2;
    ctx.strokeStyle = `#333`;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
    ctx.stroke();
    ctx.lineWidth = w;
    this.drawPoints(ctx);
  }

  drawPoints(ctx) {
    const w = ctx.lineWidth;
    ctx.lineWidth = 2;
    ctx.strokeStyle = `#999`;
    const colors = [`red`, `green`, `blue`, `yellow`];
    this.points.forEach((p, i) => {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
    ctx.lineWidth = w;
  }

  drawSkeleton(ctx) {
    const p = this.points;
    ctx.strokeStyle = `#555`;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    ctx.lineTo(p[1].x, p[1].y);
    ctx.lineTo(p[2].x, p[2].y);
    ctx.lineTo(p[3].x, p[3].y);
    ctx.stroke();
  }
}

export { Bezier };
