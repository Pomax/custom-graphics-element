/**
 *
 */
declare function setup(): void;
/**
 *
 */
declare function draw(): void;
/**
 *
 * @param {boolean} trueOrFalse
 */
declare function pointerActive(trueOrFalse: boolean): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerDown(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerUp(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerClick(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerMove(x: number, y: number): void;
/**
 *
 * @param {number} x
 * @param {number} y
 */
declare function pointerDrag(x: number, y: number): void;
/**
 *
 * @param {string} key
 * @param {boolean} shift
 * @param {boolean} alt
 * @param {boolean} ctrl
 * @param {boolean} meta
 */
declare function keyDown(
  key: string,
  shift: boolean,
  alt: boolean,
  ctrl: boolean,
  meta: boolean
): void;
/**
 *
 * @param {string} key
 * @param {boolean} shift
 * @param {boolean} alt
 * @param {boolean} ctrl
 * @param {boolean} meta
 */
declare function keyUp(
  key: string,
  shift: boolean,
  alt: boolean,
  ctrl: boolean,
  meta: boolean
): void;
/**
 *
 */
declare type width = number;
/**
 *
 */
declare type height = number;
/**
 *
 */
declare type playing = boolean;
/**
 *
 */
declare type frame = number;
/**
 *
 */
declare type frameDelta = number;
/**
 *
 */
declare type PointLike = { x: number; y: number };
/**
 *
 */
declare type pointer = {
  active: boolean;
  down: boolean;
  drag: boolean;
  mark:
    | undefined
    | {
        x: number;
        y: number;
      };
  x: number;
  y: number;
};
/**
 *
 */
declare type keyboard = {
  [letter: string]: number;
};
