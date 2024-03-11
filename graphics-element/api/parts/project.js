/**
 * Project a 3D coordinate to 2D.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * -or-
 * @param {*} p
 *
 * @returns p
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
 * Set the projector's x, y, and z axis rotation
 * in radians. Note that these are applied in order.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *       play();
 *     }**
 *     function draw() {
 *       clear(`white`);
 *       const m = millis() / 5000;
 *       rotateProjector(m, 2 * m, 3 * m);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
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
 * Set the project parameters. Currently, only
 * cabinet project is supported, which accepts
 * the following parameters:
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(width / 2, height / 2, 50, -0.4);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`red`);
 *       line(project(-1, -1, -1), project(1, -1, -1));
 *       line(project(-1, -1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(1, 1, -1));
 *       line(project(-1, 1, 1), project(1, 1, 1));
 *       setColor(`blue`);
 *       line(project(-1, -1, -1), project(-1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, 1, 1));
 *       line(project(1, -1, -1), project(1, -1, 1));
 *       line(project(1, 1, -1), project(1, 1, 1));
 *       setColor(`green`);
 *       line(project(1, 1, -1), project(1, -1, -1));
 *       line(project(1, 1, 1), project(1, -1, 1));
 *       line(project(-1, 1, -1), project(-1, -1, -1));
 *       line(project(-1, 1, 1), project(-1, -1, 1));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param  {number} x-offset of the projection wrt the canvas (default = 0)
 * @param  {number} y-offset of the projection wrt the canvas (default = 0)
 * @param  {number} scale factor for the 3D input (default = 1)
 * @param  {number} cabinet angle in radians (default = -pi/6)
 */
function setProjector(...args) {
  __projector.update(...args);
}
