// math functions
const {
  /**
   * Get the absolute value for some input
   *
   * @param {number} v Any number
   * @returns {number} The input value with its sign set to positive
   */
  abs,

  /**
   * The inverse cosine function
   *
   * Example:
   *
   * <graphics-element>
   *   <graphics-source>
   *     function draw() {
   *       setCursor(`none`);
   *       clear(`white`);
   *       translate(20, 30);
   *       const a = PI / 3;
   *       const x = cos(a);
   *       const y = sin(a);
   *       const s = (width - 60)
   *       axes(`x`, 0, s, `y`, 0, s, 0, 1, 0, 1)
   *       scale(s);
   *       setLineWidth(1 / s);*
   *
   *       noFill();
   *       arc(0, 0, 1, 0, PI / 2);
   *       arc(0, 0, 1.1, 0, PI / 3.5);
   *       line(x+25/s, y, x+35/s, y-2/s);
   *       line(x+25/s, y, x+30/s, y-10/s);
   *
   *       setColor(`black`);
   *       circle(x, y, 3/s);
   *       setFontSize(16 / s);
   *       text(`pi/3`, x+5/s, y+15/s);
   *
   *       setLineWidth(2 / s);
   *       setColor(`red`);
   *       line(0, 0, x, 0);
   *       line(0, y, x, y);
   *       text(`cos`, x/3, -2/s);
   *
   *       setColor(`blue`);
   *       line(0, 0, 0, y);
   *       line(x, 0, x, y);
   *       text(`sin`, 2/s, y/2);
   *
   *       noFill();
   *       setStroke(`#d2d`)
   *       arc(0, 0, 1, 0, PI / 3)
   *
   *       setColor(`purple`)
   *       text(`acos(red)`, 100 / s, 75 / s)
   *       text(`asin(blue)`, 100 / s, 53 / s)
   *     }
   *   </graphics-source>
   * </graphics-element>
   *
   * @param {number} v Any number
   * @returns {number} The inverse cosine of that number
   *
   * @see {@link asin}
   * @see {@link acosh}
   */
  acos,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  acosh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  asin,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  asinh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  atan,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  atan2,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  atanh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  cbrt,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  ceil,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  clz32,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  cos,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  cosh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  exp,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  expm1,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  floor,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  fround,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  hypot,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  imul,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  log: ln, // The natural logarithm is called "ln". If you call it "log", you don't math.

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  log10: log, // The function called "log" is the "common logarithm", which is base 10.

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  log2,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  max,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  min,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  pow,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  round,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  sign,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  sin,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  sinh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  sqrt,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  tan,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  tanh,

  /**
   * ...
   *
   * @param {number} input
   * @returns {number} output
   */
  trunc,
} = Math;

// constants...
const {
  /**
   * The ratio of a circle's circumference to its diameter.
   *
   * See https://en.wikipedia.org/wiki/Pi
   *
   * @constant {number}
   *
   * @see {@link TAU}
   */
  PI,

  /**
   * The base for the natural logarithm.
   *
   * See https://en.wikipedia.org/wiki/E_(mathematical_constant)
   *
   * @constant {number}
   */
  E,
} = Math;

const {
  /**
   * A very small value for performing imprecise math operations
   * such as checking whether a value is approximately the same
   * as some other value.
   *
   * @constant {number}
   */
  epsilon,

  /**
   * A very large value that can still be used to draw things
   * on the canvas (such as lines from -huge to +huge).
   *
   * @constant {number}
   */
  huge,

  /**
   * The ratio of a circle's circumference to its radius.
   *
   * See https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals
   *
   * @constant {number}
   *
   * @see {@link PI}
   */
  TAU,
} = { epsilon: 1e-10, huge: 1_000_000, TAU: PI * 2 };

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
 *
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
 *
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
 *
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
 *
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
 * @returns {number} The euclidean distance between the two coordinates
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
 *
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
 *
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
 *
 * @see {@link csc}
 */
function sec(v) {
  return 1 / cos(v);
}
