class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z === undefined ? 0 : z;
  }
  draw(ctx) {
    ctx.cacheStyle();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `black`;
    ctx.fillText(`(${this.x},${this.y})`, this.x + 10.5, this.y + 10.5);
    ctx.restoreStyle();
  }
  dist(other, y, z = 0) {
    if (y !== undefined) other = { x: other, y, z };
    let sum = 0;
    sum += (this.x - other.x) ** 2;
    sum += (this.y - other.y) ** 2;
    sum += (this.z - other.z) ** 2;
    return sum ** 0.5;
  }
  normalize(f) {
    let mag = this.dist(0,0,0);
    return new Point(
      f * this.x / mag,
      f * this.y / mag,
      f * this.z / mag,
    )
  }
  getAngle() {
    return -Math.atan2(this.y, this.x);
  }
}

export { Point };
