const POLYGON = `polygon`;
const SPLINE = `spline`;
const BEZIER = `bezier`;

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

  add(x, y, type = POLYGON) {
    const { closed, points } = this;
    if (closed) return;
    const p = { x, y, type };
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
    let virtual = true,
      T = 1;
    if (typeName === `spline`) {
      if (typeof args[args.length - 1] === `boolean`) {
        [virtual] = args.splice(args.length - 1, 1);
      } else if (typeof args[args.length - 2] === `boolean`) {
        [virtual] = args.splice(args.length - 2, 1);
      }
      if (args.length % 2 === 1) {
        [T] = args.splice(args.length - 1, 1);
      }
    }

    points.forEach((p) => {
      const op = { [typeName]: true, x: p.x, y: p.y };
      if (typeName === `spline`) Object.assign(op, { virtual, T });
      this.instructions.push(op);
    });

    this.updateSVG();
  }

  moveTo(x, y) {
    if (x.x !== undefined && x.y !== undefined) {
      y = x.y;
      x = x.x;
    }
    this._instruction(`move`, x, y);
  }

  lineTo(...args) {
    this._instruction(`line`, ...args);
  }

  curveTo(...args) {
    this._instruction(`bezier`, ...args);
  }

  splineTo(...args) {
    this._instruction(`spline`, ...args);
  }

  updateSVG() {
    const ops = this.instructions.slice();

    // As a pre-process, we're going to convert all splines to poly-Beziers.
    // Until there are no consecutive spline points left:
    // 1. find the next stretch of spline points.
    // 2. determine whether we need virtual points when virtual=true
    // 3. form equivalent Bezier segments and replace the spline sequence

    const replace = (i) => {
      const pre = i > 0 ? ops[i - 1] : false;
      const spline = [];
      while (ops[i].spline) {
        spline.push(ops.splice(i, 1)[0]);
      }
      const post = ops[i];
      const bezier = [];
      spline.forEach((op) => {
        const { virtual, T } = op;
        // Do we have pre? If not, do we need virtual?
        if (op === spline[0]) {
          if (!pre && virtual) {
            // ...
          }
        }
        // segment conversion
        {
          /*
          const p0 =
          const p1 =
          const p2 =
          const p3 =
          */
        }
        // Do we have post? If not, do we need virtual?
        if (op === spline.at(-1)) {
          if (!post && virtual) {
            // ...
          }
        }
      });
      return bezier.length - spline.length;
    };

    for (let i = 0; i < ops.length; i++) {
      if (ops[i].spline) {
        i += replace(i);
      }
    }

    let d = ``;
    while (ops.length) {
      const op = ops.shift();
      if (op.close) d = `${d} Z`;
      if (op.move) d = `M ${op.x} ${op.y}`;
      if (op.line) d = `${d} L ${op.x} ${op.y}`;
      if (op.bezier) {
        const op2 = ops.shift();
        const op3 = ops.shift();
        d = `${d} C ${op.x} ${op.y} ${op2.x} ${op2.y} ${op3.x} ${op3.y}`;
      }
    }
    this.svg_d = d;
  }

  getSVG() {
    return `<path fill="${__ctx.fillStyle}" stroke="${__ctx.strokeStyle}" d="${this.svg_d}"/>`;
  }

  close() {
    this.closed = true;
    this.instructions.push({ close: true });
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

  draw(showPoints = false) {
    this.formSVG();

    const { closed, ox, oy, points } = this;
    start();
    const s = points.slice();
    if (closed) s.push(s[0]);
    s.forEach(({ x, y }) => vertex(x + ox, y + oy));
    end();
    if (showPoints) {
      points.forEach((p) => point(p.x + ox, p.y + oy));
    }
  }

  inside(x, y) {
    // let's do some ray casting, treating the path closed.
    let crossing = 0;
    const { ox, oy, points } = this;
    const { length: n } = points;
    if (n < 3) return 0;
    for (let i = 0, p1, p2; i < n; i++) {
      p1 = points[i];
      p2 = points[(i + 1) % n];
      const r = lli(
        {
          x: p1.x + ox,
          y: p1.y + oy,
        },
        {
          x: p2.x + ox,
          y: p2.y + oy,
        },
        { x, y },
        { x, y: y - huge }
      );
      if (r?.inBounds) crossing++;
    }
    return crossing % 2 === 1;
  }
}

/**
 * ...code goes here...
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
    this.newSegment();
  }

  newSegment(closeCurrent = false) {
    const { segments } = this;
    if (segments.length === 0) {
      return segments.push(new Segment());
    }
    const current = segments.at(-1);
    if (current?.points.length) {
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
  }

  moveTo(x, y) {
    this.newSegment();
    this.segments.at(-1).moveTo(x, y);
  }

  lineTo(...args) {
    this.segments.at(-1)?.lineTo(...args);
  }

  curveTo(...args) {
    this.segments.at(-1)?.curveTo(...args);
  }

  splineTo(...args) {
    this.segments.at(-1)?.splineTo(...args);
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

  draw(showPoints = false) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.0">
  ${this.segments.map((s) => s.getSVG(showPoints))}
</svg>`;
    image(`data:image/svg+xml;base64,${btoa(svg)}`);
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
