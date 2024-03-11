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
 * @param trueOrFalse
 */
declare function pointerActive(trueOrFalse: boolean): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerDown(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerUp(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerClick(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerMove(x: number, y: number): void;
/**
 *
 * @param x
 * @param y
 */
declare function pointerDrag(x: number, y: number): void;
/**
 *
 * @param key
 * @param shift
 * @param alt
 * @param ctrl
 * @param meta
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
 * @param key
 * @param shift
 * @param alt
 * @param ctrl
 * @param meta
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
