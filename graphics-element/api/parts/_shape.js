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
    return this._instruction(`move`, x, y);
  }

  lineTo(...args) {
    return this._instruction(`line`, ...args);
  }

  curveTo(...args) {
    return this._instruction(`bezier`, ...args);
  }

  quadTo(...args) {
    return this._instruction(`quad`, ...args);
  }

  splineTo(...args) {
    return this._instruction(`spline`, ...args);
  }

  close() {
    this.closed = true;
    this.invalidate();
  }

  offset(x, y) {
    this.ox = x;
    this.oy = y;
    this.invalidate();
  }

  commit(x, y) {
    const { ox, oy, instructions } = this;
    instructions.forEach((p) => {
      p.x += x;
      p.y += y;
    });
    this.ox = 0;
    this.oy = 0;
    this.invalidate();
  }

  inside(x, y) {
    const { path } = this;
    path.setAttribute(`d`, this.svg_d);
    return path.isPointInFill(new DOMPoint(x, y));
  }

  invalidate() {
    this.updateSVG();
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
    this.path.setAttribute(`d`, d);
  }

  getSVG(showPoints, fill, stroke) {
    let svg = `<path fill="${fill}" stroke="${stroke}" d="${this.svg_d}"/>`;
    if (showPoints) {
      this.instructions.forEach(
        (p) =>
          (svg = `${svg}\n<circle fill="${fill}" stroke="${stroke}" cx="${p.x}" cy="${p.y}" r="3"/>`)
      );
    }
    return svg;
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
  ox = 0;
  oy = 0;

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
          this.invalidate();
        };
        setMovable(p);
      });
    }
    this.buildImage();
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

  offsetSegment(segmentId, x, y) {
    const segment = this.segments[segmentId];
    segment.offset(x, y);
  }

  commit() {
    const { segments, ox, oy } = this;
    segments.forEach((p) => p.commit(ox, oy));
    this.ox = this.oy = 0;
    // rebuild so it's ready by the next redraw
    this.buildImage();
  }

  reset() {
    this.ox = 0;
    this.oy = 0;
    // rebuild so it's ready by the next redraw
    this.buildImage();
  }

  noFill() {
    this.setFill(`none`);
  }

  setFill(fill) {
    if (this.fillStyle !== fill) {
      this.fillStyle = fill;
      this.buildImage();
    }
  }

  noStroke() {
    this.setStroke(`none`);
  }

  setStroke(stroke) {
    if (this.strokeStyle !== stroke) {
      this.strokeStyle = stroke;
      this.buildImage();
    }
  }

  invalidate() {
    this._cached_image = false;
  }

  buildImage() {
    const { showPoints, fillStyle, strokeStyle } = this;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="${height}px" viewBox="-${width} -${height} ${3 * width} ${3 * height}" xmlns="http://www.w3.org/2000/svg" version="1.0">
  ${this.segments.map((s) => s.getSVG(showPoints, fillStyle, strokeStyle))}
</svg>`;
    const img = (this._cached_image = new Image());
    img.loaded = new Promise((resolve) => {
      img.onload = () => resolve(true);
    });
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  showPoints(showPoints = true) {
    if (this.showPoints !== showPoints) {
      this.showPoints = showPoints;
      this.buildImage();
    }
  }

  async draw() {
    if (!this._cached_image) this.buildImage();
    const { ox, oy, _cached_image } = this;
    await _cached_image.loaded;
    image(_cached_image, ox - width, oy - height, 3 * width, 3 * height);
  }

  inside(x, y) {
    const { segments, ox, oy } = this;
    return segments
      .map((s, id) => {
        s.id = id;
        return s;
      })
      .filter((s) => s.inside(x - ox, y - oy));
  }
}
