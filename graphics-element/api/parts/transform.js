/**
 *
 */
function resetTransform() {
  __ctx.resetTransform();
}

/**
 *
 * @param {*} angle
 */
function rotate(angle = 0) {
  __ctx.rotate(angle);
}

/**
 *
 * @param {*} x
 * @param {*} y
 */
function scale(x = 1, y = x) {
  __ctx.scale(x, y);
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
function screenToWorld(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }

  let M = __ctx.getTransform().invertSelf();

  let ret = {
    x: x * M.a + y * M.c + M.e,
    y: x * M.b + y * M.d + M.f,
  };

  return ret;
}

/**
 * transforms: universal free transform based on applying
 *
 *       | a b c |
 *   m = | d e f |
 *       | 0 0 1 |
 */
function transform(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0) {
  __ctx.transform(a, b, c, d, e, f);
}

/**
 *
 * @param {*} x
 * @param {*} y
 */
function translate(x = 0, y = 0) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }
  __ctx.translate(x, y);
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
function worldToScreen(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }

  let M = __ctx.getTransform();

  let ret = {
    x: x * M.a + y * M.c + M.e,
    y: x * M.b + y * M.d + M.f,
  };

  return ret;
}
