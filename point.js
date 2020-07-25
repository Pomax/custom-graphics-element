class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z === undefined ? 0 : z;
  }
  dist(other, y, z = 0) {
    if (y !== undefined) other = { x: other, y, z };
    let sum = 0;
    sum += (this.x - other.x) ** 2;
    sum += (this.y - other.y) ** 2;
    sum += (this.z - other.z) ** 2;
    return sum ** 0.5;
  }
}

export { Point };
