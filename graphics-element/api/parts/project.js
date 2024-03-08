/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */
function project(x, y, z) {
  return __projector.project(x, y, z);
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */
function rotateProjector(x, y, z) {
  return __projector.setRotation(x, y, z);
}

/**
 *
 * @param  {...any} args
 */
function setProjector(...args) {
  __projector.update(...args);
}
