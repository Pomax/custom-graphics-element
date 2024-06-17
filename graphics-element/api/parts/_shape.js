/**
 * ...docs go here...
 */
class Shape {
  segments = [];
  resizable = false;
  dirty = true;
  ox = 0;
  oy = 0;

  constructor() {
    this.path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
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
    const segment = this.segments.at(-1);
    let pts;
    if (segment.instructions.length) {
      pts = segment.lineTo(x, y);
    } else {
      pts = segment.moveTo(x, y);
    }
    this.recordPoints(pts);
  }

  recordPoints(pts) {
    const segment = this.segments.at(-1);
    if (this.resizable) {
      pts.forEach((p) => {
        p.__on_move = () => {
          segment.invalidate();
        };
        setMovable(p);
      });
    }
  }

  moveTo(x, y) {
    this.newSegment();
    this.recordPoints(this.segments.at(-1).moveTo(x, y));
  }

  lineTo(...args) {
    this.recordPoints(this.segments.at(-1)?.lineTo(...args));
  }

  curveTo(...args) {
    this.recordPoints(this.segments.at(-1)?.curveTo(...args));
  }

  quadTo(...args) {
    this.recordPoints(this.segments.at(-1)?.quadTo(...args));
  }

  splineTo(...args) {
    this.recordPoints(this.segments.at(-1)?.splineTo(...args));
  }

  offset(x, y) {
    this.ox = x;
    this.oy = y;
  }

  commit() {
    const { ox, oy, segments } = this;
    segments.forEach((s) => s.commit(ox, oy));
    this.reset();
  }

  reset() {
    this.offset(0, 0);
  }

  flipSegment() {
    this.segments.at(-1).flip();
  }

  noFill() {
    this.setFill(`none`);
  }

  setFill(fill) {
    if (this.fillStyle !== fill) {
      this.fillStyle = fill;
    }
  }

  noStroke() {
    this.setStroke(`none`);
  }

  setStroke(stroke) {
    if (this.strokeStyle !== stroke) {
      this.strokeStyle = stroke;
    }
  }

  showPoints(showPoints = true) {
    if (this.__showPoints !== showPoints) {
      this.__showPoints = showPoints;
    }
  }

  async draw() {
    const { ox, oy, segments, __showPoints } = this;
    save();
    translate(ox, oy);
    setStroke(this.strokeStyle);
    setFill(this.fillStyle);
    start();
    segments.forEach((s) => s.draw());
    end();
    if (__showPoints) segments.forEach((s) => s.drawPoints());
    translate(-ox, -oy);
    restore();
  }

  inside(x, y) {
    const { ox, oy, path, segments } = this;
    const d = segments.map((s) => s.getPath()).join(` `);
    path.setAttribute(`d`, d);
    try {
      const p = new DOMPoint(x - ox, y - oy);
      if (path.isPointInFill(p)) return true;
      if (path.isPointInStroke(p)) return true;
    } catch (e) {
      // oh for fuck's sake, Chrome
      const p = new Path2D(path);
      if(__ctx.isPointInPath(p, x - ox, y - oy)) return true;
      if(__ctx.isPointInStroke(p, x - ox, y - oy)) return true;
    }
    return false;
  }
}

/**
 * ...docs go here...
 */
class Segment {
  points = [];
  instructions = [];

  closed = false;
  svg_d = ``;

  add(x, y) {
    const { closed, points } = this;
    if (closed) return;
    const p = { x, y };
    points.push(p);
    return p;
  }

  commit(x, y) {
    this.instructions.forEach((p) => {
      p.x += x;
      p.y += y;
    });
    this.invalidate();
  }

  flip() {
    const { instructions } = this;
    instructions.reverse();
    // remember to relocate our moveTo!
    instructions.unshift(instructions.pop());
    this.invalidate();
  }

  #instruction(typeName, ...args) {
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
      p[typeName] = true;
      if (typeName === `spline`) p.T = T;
      this.instructions.push(p);
    });

    this.invalidate();
    return points;
  }

  moveTo(x, y) {
    if (x.x !== undefined && x.y !== undefined) {
      y = x.y;
      x = x.x;
    }
    return this.#instruction(`move`, x, y);
  }

  lineTo(...args) {
    return this.#instruction(`line`, ...args);
  }

  curveTo(...args) {
    return this.#instruction(`bezier`, ...args);
  }

  quadTo(...args) {
    return this.#instruction(`quad`, ...args);
  }

  splineTo(...args) {
    return this.#instruction(`spline`, ...args);
  }

  close() {
    this.closed = true;
    this.invalidate();
  }

  invalidate() {
    this.dirty = true;
  }

  checkDirty() {
    if (this.dirty || !this.withoutSplines) {
      this.updateSVG();
      this.withoutSplines = this.instructions.slice();
      this.replaceSplineWithBeziers(this.withoutSplines);
      this.dirty = false;
    }
  }

  draw() {
    this.checkDirty();
    const ops = this.withoutSplines.slice();

    const b2 = (t, a, b, c) => {
      const mt = 1 - t;
      return a * mt ** 2 + 2 * b * mt * t + c * t ** 2;
    };

    const b3 = (t, a, b, c, d) => {
      const mt = 1 - t;
      return (
        a * mt ** 3 + 3 * b * mt ** 2 * t + 3 * c * mt * t ** 2 + d * t ** 3
      );
    };

    const vtx = (p) => {
      vertex(p.x, p.y);
    };

    const [first] = this.instructions;
    let last;
    while (ops.length) {
      const p = ops.shift();
      if (p.move) {
        __ctx.moveTo(p.x, p.y);
      }
      if (p.move || p.line) {
        vtx(p);
        last = p;
      }
      if (p.quad) {
        const n = ops.shift();
        for (let t = 0; t < 1; t += 0.05) {
          vtx({ x: b2(t, last.x, p.x, n.x), y: b2(t, last.y, p.y, n.y) });
        }
        vtx(n);
        last = n;
      }
      if (p.bezier) {
        const n = ops.shift();
        const n2 = ops.shift();
        for (let t = 0; t < 1; t += 0.03) {
          vtx({
            x: b3(t, last.x, p.x, n.x, n2.x),
            y: b3(t, last.y, p.y, n.y, n2.y),
          });
        }
        vtx(n2);
        last = n2;
      }
    }
    if (this.closed) vtx(first);
  }

  drawPoints() {
    for (let p of this.instructions) point(p);
  }

  getPath() {
    this.checkDirty();
    return this.svg_d;
  }

  updateSVG() {
    let d = ``;
    const ops = this.instructions.slice();
    this.replaceSplineWithBeziers(ops);
    while (ops.length) {
      const p = ops.shift();
      if (p.move) d = `M ${p.x} ${p.y}`;
      if (p.line) d = `${d} L ${p.x} ${p.y}`;
      if (p.quad) {
        const op = ops.shift();
        d = `${d} Q ${p.x} ${p.y} ${op.x} ${op.y}`;
      }
      if (p.bezier) {
        const op2 = ops.shift();
        const op3 = ops.shift();
        d = `${d} C ${p.x} ${p.y} ${op2.x} ${op2.y} ${op3.x} ${op3.y}`;
      }
    }
    if (this.closed) d += ` Z`;
    this.svg_d = d;
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
    q3 = splines[1] ?? ops[i] ?? ops[0];
    beziers.push(...this.firstSplineToBezier(q1, q2, p, q3));

    // Intermediate segments are "normal conversion math".
    for (let j = 1; j < splines.length; j++) {
      q1 = q2;
      q2 = p;
      p = splines[j];
      q3 = splines[j + 1] ?? ops[i] ?? ops[0];
      beziers.push(...this.fullSplineToBezier(q1, q2, p, q3));
    }

    // The last segment needs special handling to
    // ensure the arrival tangent is correct.
    q3 = ops[i] ?? ops[0];
    q4 = ops[i + 1] ?? ops[1];
    beziers.push(...this.lastSplineToBezier(q2, p, q3, q4));

    return beziers;
  }

  // p3 is our principal point
  firstSplineToBezier(p1, p2, p3, p4) {
    // Reposition p1 so that the tangent at
    // p2 will match the actual tangent at p2.
    p1 = this.updateFromTangent(p1, p2, p3);
    return this.fullSplineToBezier(p1, p2, p3, p4);
  }

  // p2 is our principal point
  lastSplineToBezier(p1, p2, p3, p4) {
    // Reposition p4 so that the tangent at
    // p3 will match the actual tangent at p3.
    p4 = this.updateFromTangent(p4, p3, p2);
    return this.fullSplineToBezier(p1, p2, p3, p4);
  }

  // create the Bezier equivalent of p2--p3
  fullSplineToBezier(p1, p2, p3, p4) {
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
