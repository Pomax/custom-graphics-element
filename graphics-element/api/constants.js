/**
 * The current frame number
 *
 * @constant {number}
 */
let frame = 0;

/**
 * The number of milliseconds since the last frame.
 *
 * @constant {number}
 */
let frameDelta = 0;

/**
 * The height of the canvas in pixels
 *
 * @constant {number}
 */
let height = 0;

/**
 * The width of the canvas in pixels
 *
 * @constant {number}
 */
let width = 0;

/**
 * The current play state
 *
 * @constant {boolean}
 */
let playing = false;

/**
 * The `pointer` object represents the mouse cursor (when using
 * a mouse) or finger position (for touch devices), and models
 * several aspects:
 *
 * - `active` (boolean) Whether the pointer is even on or over the canvas.
 * - `x` (number) The pointer's x offset in pixels with respect to the canvas
 * - `y` (number) The pointer's y offset in pixels with respect to the canvas
 * - `down` (boolean) Whether the pointer is "engaged" or not
 * - `drag` (boolean) Whether a click/touch-drag is in progress
 * - `mark` ({x,y}) When dragging, this represents the original coordinate of the pointer "down" event
 *
 * @constant {object}
 */
const pointer = { x: 0, y: 0 };

/**
 * If any points were registered as movable, and the pointer is
 * near enough to a movable point, this value will point to
 * that movable point, or `false` if the pointer is not near
 * any movable point (or, of course, there are no movable points)
 *
 * @constant {PointLike|false}
 */
let currentMovable = false;

/**
 * The `keyboard` object is a truth table that can be checked to
 * see if any key is currently pressed, and if so, when that
 * keypress was initiated, by storing:
 *
 * ```
 * {
 *   [key:string]: datetime
 * }
 * ```
 *
 * When a key is released, its mapping is removed entirely,
 * rather than it being set to a falsey value.
 *
 * @constant {object}
 */
const keyboard = {};

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
   * The ratio of a circle's circumference to its radius, i.e. 2*PI
   *
   * See https://en.wikipedia.org/wiki/Turn_(angle)#Tau_proposals
   *
   * @constant {number}
   *
   * @see {@link PI}
   */
  TAU,
} = { epsilon: 1e-10, huge: 1_000_000, TAU: PI * 2 };
