/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns
 */
function project(x, y, z) {
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }

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
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  return __projector.setRotation(x, y, z);
}

/**
 *
 * @param  {...any} args
 */
function setProjector(...args) {
  __projector.update(...args);
}
