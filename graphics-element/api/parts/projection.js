/**
 * Project a 3D "world" coordinate to a 2D "screen" coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const cabinet = setProjector(CABINET);
 *     const homogeneous = setProjector(HOMOGENEOUS);
 *
 *     function setup() {
 *       setSize(400, 200);
 *       setupProjectors();
 *     }
 *
 *     function setupProjectors() {
 *       cabinet.setPhi(-0.4);
 *       cabinet.setScale(50);
 *       cabinet.setRotation(0, 0, 0);
 *
 *       homogeneous.setInfinity(4);
 *       homogeneous.setScale(50);
 *       homogeneous.setRotation(0, 0, -0.4);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       translate(-width/4, height/2);
 *       [cabinet, homogeneous].forEach(projector => {
 *         setProjector(projector);
 *         translate(width/2, 0);
 *
 *         setColor(`black`);
 *         point(project(-1, -1, -1));
 *         setColor(`red`);
 *         point(project(1, -1, -1));
 *         setColor(`green`);
 *         point(project(-1, 1, -1));
 *         setColor(`blue`);
 *         point(project(-1, -1, 1));
 *
 *         setColor(`red`);
 *         line(project(-1, -1, -1), project(1, -1, -1));
 *         line(project(-1, -1, 1), project(1, -1, 1));
 *         line(project(-1, 1, -1), project(1, 1, -1));
 *         line(project(-1, 1, 1), project(1, 1, 1));
 *         setColor(`blue`);
 *         line(project(-1, -1, -1), project(-1, -1, 1));
 *         line(project(-1, 1, -1), project(-1, 1, 1));
 *         line(project(1, -1, -1), project(1, -1, 1));
 *         line(project(1, 1, -1), project(1, 1, 1));
 *         setColor(`green`);
 *         line(project(1, 1, -1), project(1, -1, -1));
 *         line(project(1, 1, 1), project(1, -1, 1));
 *         line(project(-1, 1, -1), project(-1, -1, -1));
 *         line(project(-1, 1, 1), project(-1, -1, 1));
 *       });
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

// TEST: Set up a 3D projector.
function setProjector(typeOrProjector) {
  if (typeOrProjector instanceof Projector) {
    __projector = typeOrProjector;
  }
  if (typeOrProjector === CABINET) {
    __projector = new CabinetProjector();
  }
  if (typeOrProjector === HOMOGENEOUS) {
    __projector = new HomogeneousProjector(250);
  }
  return __projector;
}

// TEST: Get the current projector, for reasons. Not sure I want
//       to keep this, it feels like you should only be able to
//       get a reference to the projector when you set it...?
function getProjector() {
  return __projector;
}

// TEST: when true, this should change all draw instructions
//       to project 3D to 2D automatically. Which would make
//       things super duper much nicer.
function useProjection() {
  __projection = true;
}

// TEST: this should "revert" all draw instructions to (no longer)
//       treat vertices as 3D-that-need-projecting.
function noProjection() {
  __projection = false;
}

/**
 * Set the projector's x, y, and z axis rotation
 * in radians. Note that these are applied in order.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const cabinet = setProjector(CABINET);
 *     const homogeneous = setProjector(HOMOGENEOUS);
 *
 *     function setup() {
 *       setSize(400, 200);
 *       setupProjectors();
 *       play();
 *     }
 *
 *     function setupProjectors() {
 *       cabinet.setPhi(-0.4);
 *       cabinet.setScale(50);
 *       homogeneous.setInfinity(4);
 *       homogeneous.setRotation(0, 0, -0.4);
 *       homogeneous.setScale(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       translate(-width/4, height/2);
 *       const m = millis() / 5000;
 *       [cabinet, homogeneous].forEach(projector => {
 *         setProjector(projector);
 *         projector.setRotation(m, 2 * m, 3 * m);
 *         translate(width/2, 0);
 *
 *         setColor(`black`);
 *         point(project(-1, -1, -1));
 *         setColor(`red`);
 *         point(project(1, -1, -1));
 *         setColor(`green`);
 *         point(project(-1, 1, -1));
 *         setColor(`blue`);
 *         point(project(-1, -1, 1));
 *
 *         setColor(`red`);
 *         line(project(-1, -1, -1), project(1, -1, -1));
 *         line(project(-1, -1, 1), project(1, -1, 1));
 *         line(project(-1, 1, -1), project(1, 1, -1));
 *         line(project(-1, 1, 1), project(1, 1, 1));
 *         setColor(`blue`);
 *         line(project(-1, -1, -1), project(-1, -1, 1));
 *         line(project(-1, 1, -1), project(-1, 1, 1));
 *         line(project(1, -1, -1), project(1, -1, 1));
 *         line(project(1, 1, -1), project(1, 1, 1));
 *         setColor(`green`);
 *         line(project(1, 1, -1), project(1, -1, -1));
 *         line(project(1, 1, 1), project(1, -1, 1));
 *         line(project(-1, 1, -1), project(-1, -1, -1));
 *         line(project(-1, 1, 1), project(-1, -1, 1));
 *       });
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
