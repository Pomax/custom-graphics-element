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
   * @returns {number} The hyperbolic inverse cosine
   *
   * @see {@link asinh}
   * @see {@link acos}
   */
  acosh,

  /**
   * The inverse sine function
   *
   * @param {number} input Any number
   * @returns {number} The inverse sine
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
   * @returns {number} The hyperbolic inverse sine
   *
   * @see {@link acosh}
   * @see {@link asin}
   */
  asinh,

  /**
   * The inverse tangent function
   *
   * @param {number} input Any number
   * @returns {number} The inverse tangent
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
   * @returns {number} The atan2 angle for this number pair
   */
  atan2,

  /**
   * The hyperbolic inverse tangent function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} The hyperbolic inverse tangent
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
   * @returns {number} The (real) cube root of that number
   *
   * @see {@link sqrt}
   */
  cbrt,

  /**
   * The "round up to the nearest integer" function.
   *
   * @param {number} input Any number
   * @returns {number} The integer result after rounding up.
   *
   * @see {@link floor}
   * @see {@link round}
   */
  ceil,

  /**
   * Get the number of leading zero bits in the 32-bit binary representation of a number
   *
   * @param {number} input Any number
   * @returns {number} The number of leading zero bits in the 32-bit binary representation of that number.
   */
  clz32,

  /**
   * The cosine function
   *
   * @param {number} input Any number
   * @returns {number} The cosine
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
   * @returns {number} The hyperbolic cosine
   *
   * @see {@link cos}
   * @see {@link acosh}
   */
  cosh,

  /**
   * The exponent function, that is: e^x
   *
   * @param {number} input Any number
   * @returns {number} The value of E raised to that number's power
   *
   * @see {@link E}
   */
  exp,

  /**
   * The "round down to the nearest integer" function.
   *
   * @param {number} input Any number
   * @returns {number} The integer result after rounding down.
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
   * @returns {number} The number after rounding to the nearest 32 bit floating point representation.
   *
   * @see {@link round}
   */
  fround,

  /**
   * The Euclidean hypotenuse function
   *
   * @param {number[]} ...input Two or more numbers
   * @returns {number} The hypotenuse given those numbers.
   */
  hypot,

  /**
   * The 32 bit integer multiplication function.
   *
   * @param {number} a Any 32 bit integer
   * @param {number} b Any 32 bit integer
   * @returns {number} The 32 bit integer result of a * b
   */
  imul,

  /**
   * The natural logarithm function, i.e. the base-E logarithm
   *
   * (Note that in JS this function is called "log" rather than "ln")
   *
   * @param {number} input Any number
   * @returns {number} The natural logarithm of that number
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
   * @returns {number} The common logarithm of that number
   *
   * @see {@link ln}
   */
  log10: log,

  /**
   * The binary logarithm function, i.e. the base-2 logarithm.
   *
   * @param {number} input Any number
   * @returns {number} The base 2 logarithm of that number
   *
   * @see {@link ln}
   * @see {@link log}
   */
  log2,

  /**
   * Find the maximum value in a set of numbers
   *
   * @param {number} ...input Any two or  more numbers
   * @returns {number} The highest valued number from among the input.
   *
   * @see {@link min}
   */
  max,

  /**
   * Find the minimum value in a set of numbers
   *
   * @param {number} ...input Any two or  more numbers
   * @returns {number} The lowest valued number from among the input.
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
   * @returns {number} The integer result after rounding.
   *
   * @see {@link ceil}
   * @see {@link floor}
   */
  round,

  /**
   * Get the sign of a number
   *
   * @param {number} input Any number
   * @returns {number} +1 if the number was positive, -1 if it was negative, or 0 if the input was zero.
   */
  sign,

  /**
   * The sine function
   *
   * @param {number} input Any number
   * @returns {number} The sine
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
   * @returns {number} The hyperbolic sine
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
   * @returns {number} The square root of that number
   *
   * @see {@link cbrt}
   * @see {@link pow}
   */
  sqrt,

  /**
   * The tangent function
   *
   * @param {number} input Any number
   * @returns {number} The tangent
   */
  tan,

  /**
   * The hyperbolic tangent function
   *
   * See https://en.wikipedia.org/wiki/Inverse_hyperbolic_functions#Definitions_in_terms_of_logarithms
   *
   * @param {number} input Any number
   * @returns {number} The hyperbolic tangent
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
   * @returns {number} The integer part only of that number
   *
   * @see {@link floor}
   */
  trunc,
} = Math;

/**
 * Get the binomial coefficient (n choose k).
 *
 * @param {number} n A positive integer
 * @param {number} k A positive integer less than or equal to `n`
 * @returns {number} The value (n choose k)
 */
function binomial(n, k) {
  if (n === 0) return 1;
  var lut = __binomialCoefficients;
  while (n >= lut.length) {
    var s = lut.length;
    var nextRow = [1];
    for (var i = 1, prev = s - 1; i < s; i++) {
      nextRow[i] = lut[prev][i - 1] + lut[prev][i];
    }
    nextRow[s] = 1;
    lut.push(nextRow);
  }
  return lut[n][k];
}

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
 * The cotangent function
 *
 * @param {number} input Any number
 * @returns {number} The cotangent
 *
 * @see {@link tan}
 */
function cot(v) {
  return 1 / tan(v);
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
    x1 = x1.x;
  }
  const dx = x2 - x1;
  const dy = y2 - y1;
  return hypot(dx, dy);
}

/**
 * Performs a line/line intersection test give either four points
 * defining the lines (p1--p2) and (p3--p4), or eight coordinates
 * spanning lines (x1,y1)--(x2,y2) and (x3,y3)--(x4,y4).
 *
 * This function covers both "line/line" and "segment"/"segment"
 * testing by setting a boolean value `inBounds` on the result:
 * when false, there is only a line/line intersection, but when
 * true, the actual line segments intersect.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear();
 *       center();
 *       // ...code goes here...
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} x1 The first point's x coordinate
 * @param {number} y1 The first point's y coordinate
 * @param {number} x2 The second point's x coordinate
 * @param {number} y2 The second point's y coordinate
 * @param {number} x3 The third point's x coordinate
 * @param {number} y3 The third point's y coordinate
 * @param {number} x4 The fourth point's x coordinate
 * @param {number} y4 The fourth point's y coordinate
 * @returns {PointLike|false} Either the intersection point, or false if there is no intersection
 *
 * @param {PointLine} p1 The first coordinate
 * @param {PointLine} p2 The second coordinate
 * @param {PointLine} p3 The third coordinate
 * @param {PointLine} p4 The fourth coordinate
 * @returns {PointLike|false} Either the intersection point, or false if there is no intersection
 */
function lli(x1, y1, x2, y2, x3, y3, x4, y4) {
  if (x1.x !== undefined && x1.y !== undefined) {
    y4 = y2.y;
    x4 = y2.x;
    y3 = x2.y;
    x3 = x2.x;
    y2 = y1.y;
    x2 = y1.x;
    y1 = x1.y;
    x1 = x1.x;
  }
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (d === 0) return false;

  const r = { x: nx / d, y: ny / d, inBounds: true };
  let a = x1;
  let b = x2;
  if (x1 > x2) {
    a = x2;
    b = x1;
  }
  if (r.x < a || r.x > b) r.inBounds = false;
  else {
    a = y1;
    b = y2;
    if (y1 > y2) {
      a = y2;
      b = y1;
    }
    if (r.y < a || r.y > b) r.inBounds = false;
    else {
      a = x3;
      b = x4;
      if (x3 > x4) {
        a = x4;
        b = x3;
      }
      if (r.x < a || r.x > b) r.inBounds = false;
      else {
        a = y3;
        b = y4;
        if (y3 > y4) {
          a = y4;
          b = y3;
        }
        if (r.y < a || r.y > b) r.inBounds = false;
      }
    }
  }
  return r;
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
 * @param {boolean} constrain?  A boolean that determines whether or not to constrain the resultant value to [newStart,newEnd] (default = false)
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
 * Generate a pseudo-random number.
 *
 * This is based on the SplitMix32 algorithm, covered
 * over on https://stackoverflow.com/a/47593316/740553
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(20);
 *       range(0, height + 20, 20, (v) => {
 *         text(random(), 5, v);
 *       })
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 *
 * @returns {number} A random number in the interval [0,1)
 *
 * @param {number} a The upper bound for the random number
 * @returns {number} A random number in the interval [0,a)
 *
 * @param {number} a The lower bound for the random number
 * @param {number} b The upper bound for the random number
 * @returns {number} A random number in the interval [a, b)
 *
 * @see {@link randomSeed}
 */
function random(a = 1, b) {
  const r = __prng.next();
  if (b === undefined) return a * r;
  return a + r * (b - a);
}

/**
 * Set the pseudo-random number generator seed. If no seed
 * value is provided, this is equivalent to calling:
 *
 * ```
 * randomSeed(Date.now() * Math.random())
 * ```
 *
 * @param {number} seed? The random seed value.
 *
 * @see {@link random}
 */
function randomSeed(seed = Date.now() * Math.random()) {
  __prng.reseed(seed);
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
