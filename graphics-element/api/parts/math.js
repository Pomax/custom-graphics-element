// math functions
const {
  abs,
  acos,
  acosh,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  cbrt,
  ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  floor,
  fround,
  hypot,
  imul,
  // The natural logarithm is called "ln". If you call it "log", you don't math.
  log: ln,
  // The function called "log" is the "common logarithm", which is base 10.
  log10: log,
  log2,
  max,
  min,
  pow,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  trunc,
} = Math;

// constants...
const { PI, E } = Math;
const epsilon = 1e-10;
const huge = 1_000_000;
const TAU = PI * 2;

/**
 * Constrain a number to within a given range.
 * This is really nothing more than a convenient
 * function wrapper around the statement:
 *
 * ```
 * v < s ? s : v > e ? e : v
 * ```
 *
 * @param {number} value The value to constrain
 * @param {number} lowerBound The lower bound on our value
 * @param {number} upperBound The upper bound on our value
 * @returns {number} The value, if it falls withing [lowerBound,upperBound], otherwise one of those bounds.
 * @see {@link constrainMap}
 */
function constrain(v, s, e) {
  return v < s ? s : v > e ? e : v;
}

/**
 * The cosecant function, which is:
 *
 * ```
 * 1 / sin(v)
 * ```
 *
 * @param {number} value The input value, in radians.
 * @returns {number} The cosecant of our value.
 * @see {@link sec}
 */
function csc(v) {
  return 1 / sin(v);
}

/**
 * The cotangent function, which is:
 *
 * ```
 * cos(v) / sin(v)
 * ```
 *
 * @param {number} value The input value, in radians.
 * @returns {number} The cotangent of our value.
 * @see {@link tan}
 */
function ctn(v) {
  return cos(v) / sin(v);
}

/**
 * Convert a number in radians to a number in degrees.
 * This is really nothing more than a convenient
 * function wrapper around the statement:
 *
 * ```
 * v/PI * 180
 * ```
 *
 * With one trick, in that it allows you to constrain the
 * resultant value to the standard [0, 360] interval.
 *
 * @param {number} value The value to constrain
 * @param {boolean} constrain? A boolean that determines whether or not to constrain the resultant value to [0, 360] (default = false)
 * @returns {number} The degree value corresponding to the input value in radians, optionally constrained to [0, 360]
 * @see {@link radians}
 * @see {@link constrain}
 */
function degrees(v, constrain = false) {
  let d = (v / PI) * 180;
  if (!constrain) return d;
  while (d < 0) d += 360;
  return d % 360;
}

/**
 * Calculate the 2D Euclidean distance between two points.
 *
 * @param {number} x1 The first point's x pixel value
 * @param {number} y1 The first point's y pixel value
 * @param {number} x2 The second point's x pixel value
 * @param {number} y2 The second point's y pixel value
 * @returns {number} The euclidean distance between the two coordinates
 *
 * @param {PointLike} p1 The first point's {x,y} coordinate
 * @param {PointLike} p2 The second point's {x,y} coordinate
 */
function dist(x1, y1, x2, y2) {
  if (x1.x !== undefined && x1.y !== undefined) {
    y2 = y1.y;
    x2 = y1.x;
    y1 = x1.y;
    x1 = x1.y;
  }
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

/**
 * Map a value from one interval to another, optionally
 * constrained to the target interval.
 *
 * @param {number} value Our input value
 * @param {number} originalStart The lower bound of our domain
 * @param {number} originalEnd The upper bound of our domain
 * @param {number} newStart The lower bound of our target interval
 * @param {number} newEnd The upper bound on our target interval
 * @param {boolean} constrain?  A boolean that determines whether or not to constrain the resultant value to [0,360] (default = false)
 * @returns {number} The result of mapping our value from our domain interval to our target interval, optionally constrained to the target interval.
 * @see {@link constrain}
 * @see {@link constrainMap}
 */
function map(v, s, e, ns, ne, constrained = false) {
  const i1 = e - s,
    i2 = ne - ns,
    p = v - s;
  let r = ns + (p * i2) / i1;
  if (constrained) return constrain(r, ns, ne);
  return r;
}

/**
 * Convert a number in degrees to a number in radians.
 * This is really nothing more than a convenient
 * function wrapper around the statement:
 *
 * ```
 * v/180 * PI
 * ```
 *
 * With one trick, in that it allows you to constrain the
 * resultant value to the standard [0, TAU] interval.
 *
 * @param {number} value The value to constrain
 * @param {boolean} constrain? A boolean that determines whether or not to constrain the resultant value to [0, TAU] (default = false)
 * @returns {number} The radians value corresponding to the input value in degrees, optionally constrained to [0, TAU]
 * @see {@link degrees}
 * @see {@link constrain}
 */
function radians(v, constrain = false) {
  let r = (v / 180) * PI;
  if (!constrain) return r;
  while (r < 0) r += TAU;
  return r % TAU;
}

/**
 * Generate a random number.
 *
 * @returns {number} A random number in the interval [0,1)
 *
 * @param {number} a The upper bound for the random number
 * @returns {number} A random number in the interval [0,a)
 *
 * @param {number} a The lower bound for the random number
 * @param {number} b The upper bound for the random number
 * @returns {number} A random number in the interval [a, b)
 */
function random(a = 1, b) {
  if (b === undefined) return a * Math.random();
  return a + Math.random() * (b - a);
}

/**
 * The secant function, which is:
 *
 * ```
 * 1 / cos(v)
 * ```
 *
 * @param {number} value The input value, in radians.
 * @returns {number} The secant of our value.
 * @see {@link csc}
 */
function sec(v) {
  return 1 / cos(v);
}
