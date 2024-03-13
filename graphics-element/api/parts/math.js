const {
  /**
   * Get the absolute value for some input
   *
   * Example:
   *
   * <graphics-element>
   *   <graphics-source>
   *     function draw() {
   *       clear(`white`);
   *       translate(0, height/2);
   *       noFill();
   *       setStroke(`black`);
   *       line(-huge, 0, huge, 0);
   *
   *       const w2 = width/2;
   *       const data = array(width, (x) => [x, x - w2, abs(x - w2)]);
   *
   *       setStroke(`red`);
   *       plotData(data, 0, 1);
   *
   *       setStroke(`blue`);
   *       plotData(data, 0, 2);
   *     }
   *   </graphics-source>
   * </graphics-element>
   *
   * @param {number} v Any number
   * @returns {number} The input value with its sign set to positive
   */
  abs,

  /**
   * The inverse cosine function
   *
   * @param {number} v Any number
   * @returns {number} The inverse cosine of that number
   *
   * @see {@link asin}
   * @see {@link acosh}
   */
  acos,

  /**
   * The hyperbolic inverse cosine function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic inverse cosine
   *
   * @see {@link asinh}
   * @see {@link acos}
   */
  acosh,

  /**
   * The inverse sine function
   *
   * @param {number} input Any number
   * @returns {number} output The inverse sine
   *
   * @see {@link acos}
   * @see {@link asinh}
   */
  asin,

  /**
   * The hyperbolic inverse sine function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic inverse sine
   *
   * @see {@link acosh}
   * @see {@link asin}
   */
  asinh,

  /**
   * The inverse tangent function
   *
   * @param {number} input Any number
   * @returns {number} output The inverse tangent
   *
   * @see {@link tan}
   */
  atan,

  /**
   * The "atan2" function
   *
   * See https://en.wikipedia.org/wiki/Atan2
   *
   * @param {y} input Any number
   * @param {x} input Any number
   * @returns {number} output The atan2 angle for this number pair
   */
  atan2,

  /**
   * The hyperbolic inverse tangent function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic inverse tangent
   *
   * @see {@link tan}
   * @see {@link acosh}
   * @see {@link asinh}
   */
  atanh,

  /**
   * The cube root function
   *
   * @param {number} input Any number
   * @returns {number} output The (real) cube root of that number
   *
   * @see {@link sqrt}
   */
  cbrt,

  /**
   * The "round up to the nearest integer" function.
   *
   * @param {number} input Any number
   * @returns {number} output The integer result after rounding up.
   *
   * @see {@link floor}
   * @see {@link round}
   */
  ceil,

  /**
   * Get the number of leading zero bits in the 32-bit binary representation of a number
   *
   * @param {number} input Any number
   * @returns {number} output The number of leading zero bits in the 32-bit binary representation of that number.
   */
  clz32,

  /**
   * The cosine function
   *
   * @param {number} input Any number
   * @returns {number} output The cosine
   *
   * @see {@link sin}
   */
  cos,

  /**
   * The hyperbolic cosine function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic cosine
   *
   * @see {@link cos}
   * @see {@link acosh}
   */
  cosh,

  /**
   * The exponent function, that is: e^x
   *
   * @param {number} input Any number
   * @returns {number} output The value of E raised to that number's power
   *
   * @see {@link E}
   */
  exp,

  /**
   * The "round down to the nearest integer" function.
   *
   * @param {number} input Any number
   * @returns {number} output The integer result after rounding down.
   *
   * @see {@link ceil}
   * @see {@link round}
   */
  floor,

  /**
   * Round a number to the nearest 32 bit, rather than the
   * standard JS 64 bit, floating point representation.
   *
   * @param {number} input Any number
   * @returns {number} output The number after rounding to the nearest 32 bit floating point representation.
   *
   * @see {@link round}
   */
  fround,

  /**
   * The Euclidean hypotenuse function
   *
   * @param {number[]} ...input Two or more numbers
   * @returns {number} output The hypotenuse given those numbers.
   */
  hypot,

  /**
   * The 32 bit integer multiplication function.
   *
   * @param {number} a Any 32 bit integer
   * @param {number} b Any 32 bit integer
   * @returns {number} output The 32 bit integer result of a * b
   */
  imul,

  /**
   * The natural logarithm function, i.e. the base-E logarithm
   *
   * (Note that in JS this function is called "log" rather than "ln")
   *
   * @param {number} input Any number
   * @returns {number} output The natural logarithm of that number
   *
   * @see {@link E}
   * @see {@link log}
   */
  log: ln,

  /**
   * The "common logarithm" function, i.e. the base-10 logarithm.
   *
   * (Note that in JS this function is called "log10" rather than "log")
   *
   * @param {number} input Any number
   * @returns {number} output The common logarithm of that number
   *
   * @see {@link ln}
   */
  log10: log,

  /**
   * The binary logarithm function, i.e. the base-2 logarithm.
   *
   * @param {number} input Any number
   * @returns {number} output The base 2 logarithm of that number
   *
   * @see {@link ln}
   * @see {@link log}
   */
  log2,

  /**
   * Find the maximum value in a set of numbers
   *
   * @param {number} ...input Any two or  more numbers
   * @returns {number} output The highest valued number from among the input.
   *
   * @see {@link min}
   */
  max,

  /**
   * Find the minimum value in a set of numbers
   *
   * @param {number} ...input Any two or  more numbers
   * @returns {number} output The lowest valued number from among the input.
   *
   * @see {@link max}
   */
  min,

  /**
   * The power function.
   *
   * Note that this function is a holdover from before JS
   * had the `**` operator for performing this calculation.
   *
   * @param {number} a Any number
   * @param {number} b Any number
   * @returns {number|NaN} output a ** b or NaN if that is undefined
   */
  pow,

  /**
   * The "round to the nearest integer" function, rounding any
   * value [x.0, x.4999...] to x, and any value [x.5, x.999...]
   * to x + 1.
   *
   * @param {number} input Any number
   * @returns {number} output The integer result after rounding.
   *
   * @see {@link ceil}
   * @see {@link floor}
   */
  round,

  /**
   * Get the sign of a number
   *
   * @param {number} input Any number
   * @returns {number} output +1 if the number was positive, -1 if it was negative, or 0 if the input was zero.
   */
  sign,

  /**
   * The cosine function
   *
   * @param {number} input Any number
   * @returns {number} output The sine
   *
   * @see {@link cos}
   */
  sin,

  /**
   * The hyperbolic sine function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic sine
   *
   * @see {@link sin}
   * @see {@link acosh}
   */
  sinh,

  /**
   * The square root function.
   *
   *
   * Note that this function is a holdover from before JS
   * had the `**` operator for performing this calculation
   * by using `x ** 0.5`.
   *
   * @param {number} input Any number
   * @returns {number} output The square root of that number
   *
   * @see {@link cbrt}
   * @see {@link pow}
   */
  sqrt,

  /**
   * The tangent function
   *
   * @param {number} input Any number
   * @returns {number} output The tangent
   */
  tan,

  /**
   * The hyperbolic tangent function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} output The hyperbolic tangent
   *
   * @see {@link tan}
   * @see {@link asinh}
   * @see {@link acosh}
   */
  tanh,

  /**
   * Truncate a fraction to an integer by simply dropping the fractional part.
   * Note that this differs from the `floor` function:
   *
   * ```
   * floor(4.2);  // 4
   * floor(-4.2); // -5
   *
   * trunc(4.2);  // 4
   * trunc(-4.2); // -4
   * ```
   *
   * @param {number} input Any number
   * @returns {number} output The integer part only of that number
   *
   * @see {@link floor}
   */
  trunc,
} = Math;

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
  const dx = x2 - x1;
  const dy = y2 - y1;
  return hypot(dx, dy);
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
