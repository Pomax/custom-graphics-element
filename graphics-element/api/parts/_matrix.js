class Matrix {
  constructor(n, m, data) {
    data = n instanceof Array ? n : data;
    this.data =
      data ?? [...new Array(n)].map((v) => [...new Array(m)].map((v) => 0));
    this.rows = this.data.length;
    this.cols = this.data[0].length;
  }
  setData(data) {
    this.data = data;
  }
  get(i, j) {
    return this.data[i][j];
  }
  set(i, j, value) {
    this.data[i][j] = value;
  }
  row(i) {
    return this.data[i];
  }
  col(j) {
    var d = this.data,
      col = [];
    for (let r = 0, l = d.length; r < l; r++) {
      col.push(d[r][j]);
    }
    return col;
  }
  multiply(other) {
    return new Matrix(multiplyMatrix(this.data, other.data));
  }
  invert() {
    return new Matrix(invertMatrix(this.data));
  }
  transpose() {
    return new Matrix(transposeMatrix(this.data));
  }
  transform(input) {
    const { data } = this;
    if (input.length !== data[0].length) {
      throw new Error(
        `cannot apply ${data.length}x${data[0].length} matrix to ${input.length}D vector`
      );
    }
    return data.map((w) => w.reduce((t, e, i) => t + e * (input[i] ?? 0), 0));
  }
}
