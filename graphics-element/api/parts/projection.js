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
 *
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
 * @param {number} x The 3D coordinate's x value
 * @param {number} y The 3D coordinate's x value
 * @param {number} z The 3D coordinate's x value
 * @returns {PointLike} p  The projected 2D {x,y} coordinate
 *
 * @param {PointLike} p The 2D coordinate as {x,y,z} coordinate
 * @returns {PointLike} p  The projected 2D {x,y} coordinate
 *
 * @see {@link setProjector}
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
 *     }
 *
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
 * @param {number} x The angle of rotation over the x axis in radians
 * @param {number} y The angle of rotation over the y axis in radians
 * @param {number} z The angle of rotation over the z axis in radians
 *
 * @see {@link project}
 */
function rotateProjector(x, y, z) {
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  __projector.setRotation(x, y, z);
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
 *
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
 * @param  {number} xOffset of the projection wrt the canvas (default = 0)
 * @param  {number} yOffset of the projection wrt the canvas (default = 0)
 * @param  {number} scale factor for the 3D input (default = 1)
 * @param  {number} cabinet angle in radians (default = -pi/6)
 *
 * @see {@link project}
 */
function setProjector(...args) {
  __projector.update(...args);
}
