export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Circle extends Point {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
  }
}

export class Vec2 extends Point {
  constructor(x, y) {
    super(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // "add"/"sub" add and remove values in-place
  add(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  // "plus" and "minus" generate a new vector
  plus(x, y) {
    return new Vec2(this.x + x, this.y + y);
  }

  sub(x, y) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  minus(x, y) {
    return new Vec2(this.x - x, this.y - y);
  }

  times(sx, sy = sx) {
    return new Vec2(this.x * sx, this.y * sy);
  }

  // "scale" scales in-place
  scale(sx, sy = sx) {
    this.x *= sx;
    this.y *= sy;
    return this;
  }

  // "mul"/"div" yield new vectors
  mul(s) {
    return new Vec2(this.x * s, this.y * s);
  }

  div(s) {
    return new Vec2(this.x / s, this.y / s);
  }

  // "flip" happens in-place
  flip() {
    this.x = -x;
    this.y = -y;
    return this;
  }

  // "opposite" yields a new, flipped vector
  opposite() {
    return new Vec2(-this.x, -this.y);
  }

  // "normalize" yields a new vector
  normalize() {
    const m = this.mag();
    return this.div(m);
  }

  // "rotate" happens in-place
  rotate(angle, ox = 0, oy = 0) {
    const x = this.x - ox;
    const y = this.y - oy;
    this.x = ox + x * cos(angle) - y * sin(angle);
    this.y = oy + x * sin(angle) + y * cos(angle);
    return this;
  }

  // "sweep" yields a new, rotated vector
  sweep(angle, ox, oy) {
    return new Vec2(this).rotate(angle, ox, oy);
  }

  to(other, ratio) {
    return this.lerp(other, ratio);
  }

  lerp(v2, t) {
    const mt = 1 - t;
    return new Vec2(mt * this.x + t * v2.x, mt * this.y + t * v2.y);
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  mag() {
    const { x, y } = this;
    return (x * x + y * y) ** 0.5;
  }
}
