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
