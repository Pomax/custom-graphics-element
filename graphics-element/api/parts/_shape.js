/**
 * ...docs go here...
 */
class Segment {
  closed = false;
  ox = 0;
  oy = 0;
  points = [];

  add(x, y) {
    const { closed, points } = this;
    if (closed) return;
    const p = { x, y };
    points.push(p);
    return p;
  }

  close() {
    this.closed = true;
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
    this.segments.at(-1).close();
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
    const p = this.segments.at(-1).add(x, y);
    if (this.resizable) setMovable(p);
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
    this.segments.forEach((p) => p.draw(showPoints));
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
