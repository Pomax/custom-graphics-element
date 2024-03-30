/**
 * ...docs go here...
 */
class Segment {
  ox = 0;
  oy = 0;
  points = [];
  instructions = [];

  closed = false;
  svg_d = ``;

  constructor() {
    this.path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
  }

  add(x, y) {
    const { closed, points } = this;
    if (closed) return;
    const p = { x, y };
    points.push(p);
    return p;
  }

  _instruction(typeName, ...args) {
    let points = args;

    if (typeof args[0] === `number`) {
      points = [];
      for (let i = 0; i < args.length; i += 2) {
        points.push({ x: args[i], y: args[i + 1] });
      }
    }

    // see draw.spline(...args)
    let T = 1;
    if (typeName === `spline`) {
      if (args.length % 2 === 1) {
        [T] = args.splice(args.length - 1, 1);
        points.pop();
      }
    }

    points.forEach((p) => {
      const op = { [typeName]: true, x: p.x, y: p.y };
      if (typeName === `spline`) Object.assign(op, { T });
      this.instructions.push(op);
    });

    this.updateSVG();
  }

  moveTo(x, y) {
    if (x.x !== undefined && x.y !== undefined) {
      y = x.y;
      x = x.x;
    }
    // TODO: continue here, make points real points
    this._instruction(`move`, x, y);
  }

  lineTo(...args) {
    // TODO: continue here, make points real points
    this._instruction(`line`, ...args);
  }

  curveTo(...args) {
    // TODO: continue here, make points real points
    this._instruction(`bezier`, ...args);
  }

  splineTo(...args) {
    // TODO: continue here, make points real points
    this._instruction(`spline`, ...args);
  }

  updateSVG() {
    let d = ``;
    const ops = this.instructions.slice();
    this.replaceSplineWithBeziers(ops);
    while (ops.length) {
      const op = ops.shift();
      if (op.move) d = `M ${op.x} ${op.y}`;
      if (op.line) d = `${d} L ${op.x} ${op.y}`;
      if (op.bezier) {
        const op2 = ops.shift();
        const op3 = ops.shift();
        d = `${d} C ${op.x} ${op.y} ${op2.x} ${op2.y} ${op3.x} ${op3.y}`;
      }
    }
    if (this.closed) d += ` Z`;
    this.svg_d = d;
    this.path.setAttribute(`d`, d);
  }

  getSVG() {
    return `<path fill="${__ctx.fillStyle}" stroke="${__ctx.strokeStyle}" d="${this.svg_d}"/>`;
  }

  close() {
    this.closed = true;
    this.updateSVG();
  }

  offset(x, y) {
    this.ox = x;
    this.oy = y;
  }

  commit() {
    const { ox, oy, points } = this;
    points.forEach((p) => {
      p.x += ox;
      p.y += oy;
    });
    this.ox = 0;
    this.oy = 0;
  }

  inside(x, y) {
    const { path } = this;
    path.setAttribute(`d`, this.svg_d);
    return path.isPointInFill(new DOMPoint(x, y));
  }

  // =============================================================
  // Code *just* for converting cardinal splines into poly-Beziers
  // =============================================================

  replaceSplineWithBeziers(ops) {
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].spline) {
        this.convertSpline(ops, i);
      }
    }
  }

  convertSpline(ops, i) {
    const splines = [];
    // remove the sequence of spline points starting at ops[i]
    while (ops[i] && ops[i].spline) splines.push(ops.splice(i, 1)[0]);
    // inject the equivalent bezier sequence
    ops.splice(i, 0, ...this.splinePointsToBezierPoints(splines, ops, i));
  }

  splinePointsToBezierPoints(splines, ops, i) {
    let beziers = [];
    let q1 = ops.at(i - 2);
    let q2 = ops.at(i - 1);
    let q3, q4;
    let p = splines[0];

    // The first  segment needs special handling to
    // ensure the departure tangent is correct.
    q3 = splines[1] ?? ops[0];
    beziers.push(...this.firstSplineToBezier(q1, q2, p, q3, ops, i));

    // Intermediate segments are "normal conversion math".
    for (let j = 1; j < splines.length; j++) {
      q1 = q2;
      q2 = p;
      p = splines[j];
      q3 = splines[j + 1] ?? ops[i] ?? ops[0];
      beziers.push(...this.fullSplineToBezier(q1, q2, p, q3, ops, i));
    }

    // The last segment needs special handling to
    // ensure the arrival tangent is correct.
    q3 = ops[i] ?? ops[0];
    q4 = ops[i + 1] ?? ops[1];
    beziers.push(...this.lastSplineToBezier(q2, p, q3, q4, ops, i));

    return beziers;
  }

  // p3 is our principal point
  firstSplineToBezier(p1, p2, p3, p4, ops, i) {
    // Reposition p1 so that the tangent at
    // p2 will match the actual tangent at p2.
    p1 = this.updateFromTangent(p1, p2, p3);
    return this.fullSplineToBezier(p1, p2, p3, p4, ops, i);
  }

  // p2 is our principal point
  lastSplineToBezier(p1, p2, p3, p4, ops, i) {
    // Reposition p4 so that the tangent at
    // p3 will match the actual tangent at p3.
    p4 = this.updateFromTangent(p4, p3, p2);
    return this.fullSplineToBezier(p1, p2, p3, p4, ops, i);
  }

  // create the Bezier equivalent of p2--p3
  fullSplineToBezier(p1, p2, p3, p4, ops, i) {
    const T = p3.T ?? p2.T ?? 1;
    const tension = 6 * T;
    return [
      {
        bezier: true,
        x: p2.x + (p3.x - p1.x) / tension,
        y: p2.y + (p3.y - p1.y) / tension,
      },
      {
        bezier: true,
        x: p3.x - (p4.x - p2.x) / tension,
        y: p3.y - (p4.y - p2.y) / tension,
      },
      { bezier: true, x: p3.x, y: p3.y },
    ];
  }

  updateFromTangent(q1, q2, p3) {
    // No matter whether q1 and q2 are line or
    // bezier coordinates, the logic is the same.
    return {
      tangentCorrection: true,
      x: p3.x + (q1.x - q2.x),
      y: p3.y + (q1.y - q2.y),
    };
  }
}

/**
 * ...docs go here...
 */
class Shape {
  segments = [];
  resizable = false;

  constructor() {
    this.newSegment();
  }

  makeMovable(movable = true) {
    if (movable) {
      setMovable(this);
    } else {
      unsetMovable(this);
    }
  }

  allowResizing(allowed = true) {
    this.resizable = allowed;
  }

  close() {
    this.newSegment(true);
  }

  newSegment(closeCurrent = false) {
    const { segments } = this;
    if (segments.length === 0) {
      return segments.push(new Segment());
    }
    const current = segments.at(-1);
    if (current?.points.length || current?.instructions.length) {
      if (closeCurrent) current.close();
      segments.push(new Segment());
    }
  }

  add(x, y) {
    if (x.x !== undefined && x.y !== undefined) {
      y = x.y;
      x = x.x;
    }
    const p = this.segments.at(-1).add(x, y);
    if (this.resizable) setMovable(p);
    this._svg = false;
  }

  moveTo(x, y) {
    this.newSegment();
    const pts = this.segments.at(-1).moveTo(x, y);
    if (this.resizable) pts.forEach((p) => setMovable(p));
    this._svg = false;
  }

  lineTo(...args) {
    const pts = this.segments.at(-1)?.lineTo(...args);
    if (this.resizable) pts.forEach((p) => setMovable(p));
    this._svg = false;
  }

  curveTo(...args) {
    const pts = this.segments.at(-1)?.curveTo(...args);
    if (this.resizable) pts.forEach((p) => setMovable(p));
    this._svg = false;
  }

  splineTo(...args) {
    const pts = this.segments.at(-1)?.splineTo(...args);
    if (this.resizable) pts.forEach((p) => setMovable(p));
    this._svg = false;
  }

  offset(x, y, segmentId = undefined) {
    const { segments } = this;
    if (segmentId !== undefined) {
      segments[segmentId].offset(x, y);
    } else {
      segments.forEach((p) => p.offset(x, y));
    }
  }

  commit() {
    this.segments.forEach((p) => p.commit());
  }

  reset() {
    segments.forEach((p) => p.offset(0, 0));
  }

  buildImage(showPoints) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.0">
  ${this.segments.map((s) => s.getSVG(showPoints))}
</svg>`;
    const img = (this._img = new Image());
    img.showPoints = showPoints;
    img.loaded = new Promise((resolve) => {
      img.onload = () => resolve(true);
    });
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  async draw(showPoints = false) {
    if (!this._img || this._img.showPoints !== showPoints) {
      this.buildImage(showPoints);
    }
    await this._img.loaded;
    image(this._img);
  }

  inside(x, y) {
    return this.segments
      .map((s, id) => {
        s.id = id;
        return s;
      })
      .filter((s) => s.inside(x, y));
  }
}
