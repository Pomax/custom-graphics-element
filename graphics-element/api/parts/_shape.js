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
    let T = 1;
    if (typeName === `spline`) {
      if (args.length % 2 === 1) {
        [T] = args.splice(args.length - 1, 1);
        console.log(`splitting off T=${T}`);
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
      let pre = i > 0 ? ops[i - 1] : false;
      const spline = [];

      console.log(`replace starting at`, ops[i]);
      while (ops[i] && ops[i].spline) {
        spline.push(ops.splice(i, 1)[0]);
      }
      console.log(`spline:`, spline.slice());
      console.log(`ops:`, ops.slice());
      let post = ops[i];

      const getBezierOpsGiven = (p1, p2, p3, p4, T) => {
        const tension = 6 * T;
        if (p2.line && p1.line) {
          // since neither p2 or p1 are spline points,
          // but we want the curve to have a tangent
          // parallel to p2--p1, we need to move p1
          const dx12 = p1.x - p2.x;
          const dy12 = p1.y - p2.y;
          p1 = {
            x: p3.x + dx12,
            y: p3.y + dy12,
          };
        }

        if (p4 && p4.line && p3.line) {
          // since neither p3 or p4 are spline points,
          // but we want the curve to have a tangent
          // parallel to p3--p4, we need to move p4
          const dx43 = p4.x - p3.x;
          const dy43 = p4.y - p3.y;
          p4 = {
            x: p2.x + dx43,
            y: p2.y + dy43,
          };
        } else {
          p4 = {
            x: p3.x + (p3.x - p2.x),
            y: p3.y + (p3.y - p2.y),
          };
        }

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
      };

      const beziers = [];
      let p1, p2, p3, p4;

      // special case handling for a single spline point
      if (spline.length === 1) {
        p1 = ops[i - 2]; // may be wrong point!
        p2 = ops[i - 1];
        p3 = spline[0];
        p4 = ops[i];

        if (!p4 && this.closed) {
          p4 = ops[0];
        }

        // FIXME: only allow as intermediate
        if (!p4) return 0;

        beziers.push(...getBezierOpsGiven(p1, p2, p3, p4, p3.T));

        p1 = p2;
        p2 = p3;
        p3 = p4;
        p4 = ops[i + 1];

        if (!p4 && this.closed) {
          p4 = ops[1];
        }

        beziers.push(...getBezierOpsGiven(p1, p2, p3, p4, p3.T ?? p2.T));

        ops.splice(i, 1, ...beziers);
        return beziers.length - 1;
      }

      spline.forEach((p3, j) => {
        // Determine our p1 and p2
        if (p3 === spline[0]) {
          p2 = ops[i - 1];
          if (i - 2 >= 0) {
            p1 = ops[i - 2];
          } else if (this.closed) {
            p1 = ops.at(-1);
          } else {
            p1 = {
              x: p2.x + (p2.x - p3.x),
              y: p2.y + (p2.y - p3.y),
            };
          }
        } else if (p3 === spline[1]) {
          p2 = spline[0];
          p1 = ops[i - 1];
        } else {
          p2 = spline[j - 1];
          p1 = spline[j - 2];
        }
        // Determine our p4
        if (p3 === spline.at(-1)) {
          p4 = ops[i + j + 1];
        } else {
          p4 = spline[j + 1];
        }
        if (!p4 && this.closed) {
          p4 = ops[0];
        }
        // FIXME: intermediary only
        if (!p4) return 0;

        console.log(`multi spline replace`, p1, p2, p3, p4);
        beziers.push(...getBezierOpsGiven(p1, p2, p3, p4));
      });

      ops.splice(i, spline.length, ...beziers);
      return beziers.length - spline.length;
    };

    console.log(`start:`, ops.slice());
    for (let i = 0; i < ops.length; i++) {
      console.log(ops[i]);
      if (ops[i].spline) {
        i += replace(i);
      }
    }

    console.log(`after:`, ops.slice());

    let d = ``;
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
    console.log(this.svg_d);
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
    console.log(svg);
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
