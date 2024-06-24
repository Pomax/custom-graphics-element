/**
 * Set up a 3D to 2D projector. This can be either a `CABINET`
 * or `HOMOGENEOUS` projector, supporting the following API:
 *
 * - `projector.setRotation(x, y, z)`
 * - `projector.setTranslation(tx, ty, tz)`
 * - `projector.setScale(tx, ty, tz)`
 *
 * furthermore, the `CABINET` projector supports setting the
 * default cabinet angle using:
 *
 * - `projector.setPhi(phi)`
 *
 * and the `HOMOGENEOUS` projection supports setting the distance
 * of the point-at-infinity by using:
 *
 * - `projector.setInfinity(distance)` (note, `distance` can be `Infinity`)
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const cabinet = createProjector(CABINET);
 *     const homogeneous = createProjector(HOMOGENEOUS);
 *     const bottom = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *     const top = bottom.map(v => [v[0], v[1], 1]);
 *
 *     function setup() {
 *       setSize(400, 200);
 *       cabinet.setScale(50);
 *       homogeneous.setScale(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       translate(-width/4, height/2);
 *       [cabinet, homogeneous].forEach(projector => {
 *         setProjector(projector);
 *         translate(width/2, 0);
 *         drawAxisPoints();
 *         drawCube();
 *       });
 *     }
 *
 *     function drawAxisPoints() {
 *       setColor(`black`);
 *       point(...bottom[0]);
 *       setColor(`red`);
 *       point(...bottom[1]);
 *       setColor(`green`);
 *       point(...bottom[3]);
 *       setColor(`blue`);
 *       point(...top[0]);
 *     }
 *
 *     function drawCube() {
 *       noFill();
 *       setStroke(`red`);
 *       [bottom, top].forEach(r => {
 *         line(...r[0], ...r[1]);
 *         line(...r[2], ...r[3]);
 *       });
 *       setStroke(`green`);
 *       [bottom, top].forEach(r => {
 *         line(...r[1], ...r[2]);
 *         line(...r[3], ...r[0]);
 *       });
 *       setStroke(`blue`);
 *       [0,1,2,3].forEach(i => line(...bottom[i], ...top[i]));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {implied} falsey when called with a falsey argument (or no argument), disables projector related functionality.
 * @returns {false} false.
 *
 * @param {Symbol} projectorType This sets up a new projector, of type {@link CABINET} or {@link HOMOGENOUS}.
 * @param {boolean} project Optional. When true, immediately enable coordinate projection. Default: true
 * @returns {Projector} The current projector.
 *
 * @param {Projector} projector This sets the projector to the one passed as argument.
 * @param {boolean} project Optional. When true, immediately enable coordinate projection. Default: true
 * @returns {Projector} The current projector.
 *
 * @see {@link createProjector}
 * @see {@link useProjection}
 * @see {@link noProjection}
 * @see {@link noProjector}
 * @see {@link project}
 */
function setProjector(typeOrProjector = false, project = true) {
  if (!typeOrProjector) {
    noProjection();
    return (__projector = false);
  } else if (typeOrProjector instanceof Projector) {
    __projector = typeOrProjector;
  } else if (typeOrProjector === CABINET) {
    __projector = new CabinetProjector();
  } else if (typeOrProjector === HOMOGENEOUS) {
    __projector = new HomogeneousProjector(250);
  }
  if (project) useProjection();
  return __projector;
}

/**
 * Create a 3D to 2D projector. This can be either a `CABINET`
 * or `HOMOGENEOUS` projector, supporting the following API:
 *
 * - `projector.setRotation(x, y, z)`
 * - `projector.setTranslation(tx, ty, tz)`
 * - `projector.setScale(tx, ty, tz)`
 *
 * furthermore, the `CABINET` projector supports setting the
 * default cabinet angle using:
 *
 * - `projector.setPhi(phi)`
 *
 * and the `HOMOGENEOUS` projection supports setting the distance
 * of the point-at-infinity by using:
 *
 * - `projector.setInfinity(distance)` (note, `distance` can be `Infinity`)
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const cabinet = createProjector(CABINET);
 *     const homogeneous = createProjector(HOMOGENEOUS);
 *     const bottom = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *     const top = bottom.map(v => [v[0], v[1], 1]);
 *
 *     function setup() {
 *       setSize(400, 200);
 *       cabinet.setScale(50);
 *       homogeneous.setScale(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       translate(-width/4, height/2);
 *       [cabinet, homogeneous].forEach(projector => {
 *         setProjector(projector);
 *         translate(width/2, 0);
 *         drawAxisPoints();
 *         drawCube();
 *       });
 *     }
 *
 *     function drawAxisPoints() {
 *       setColor(`black`);
 *       point(...bottom[0]);
 *       setColor(`red`);
 *       point(...bottom[1]);
 *       setColor(`green`);
 *       point(...bottom[3]);
 *       setColor(`blue`);
 *       point(...top[0]);
 *     }
 *
 *     function drawCube() {
 *       noFill();
 *       setStroke(`red`);
 *       [bottom, top].forEach(r => {
 *         line(...r[0], ...r[1]);
 *         line(...r[2], ...r[3]);
 *       });
 *       setStroke(`green`);
 *       [bottom, top].forEach(r => {
 *         line(...r[1], ...r[2]);
 *         line(...r[3], ...r[0]);
 *       });
 *       setStroke(`blue`);
 *       [0,1,2,3].forEach(i => line(...bottom[i], ...top[i]));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {Symbol} projectorType This sets up a new projector, of type {@link CABINET} or {@link HOMOGENOUS}.
 * @returns {Projector} A new projector instance.
 *
 * @see {@link setProjector}
 * @see {@link useProjection}
 * @see {@link noProjection}
 * @see {@link noProjector}
 * @see {@link project}
 */
function createProjector(type) {
  if (type === CABINET) {
    return new CabinetProjector();
  }
  if (type === HOMOGENEOUS) {
    return new HomogeneousProjector(250);
  }
  return null;
}

/**
 * Unset the 3D projector, if one is currently active. This is
 * equivalent to calling `setProjector(false)`, and will turn
 * off projection **and** unbind the current projector. This
 * can be useful, but most of the time you'll want to use the
 * {@link useProjection} and {@link noProjection} functions instead.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(HOMOGENEOUS);
 *       scaleProjector(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       center();
 *       setStroke(`#333`);
 *       setFill(`#FF05`);
 *       poly(plane);
 *       noProjector();
 *       setFill(`#F0F5`);
 *       poly(plane.map(v => ([50 * v[0], 50 * v[1]])));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @see {@link setProjector}
 */
function noProjector() {
  setProjector(false);
}

/**
 * Enable a currently disabled 3D projector, allowing  you to
 * mix projective 3D and regular 2D with relatively little effort.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(HOMOGENEOUS);
 *       scaleProjector(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       center();
 *
 *       noProjection();
 *       setFill(`#F0F5`);
 *       poly(plane.map(v => ([50 * v[0], 50 * v[1]])));
 *
 *       useProjection();
 *       setStroke(`#333`);
 *       setFill(`#FF05`);
 *       poly(plane);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @see {@link noProjection}
 */
function useProjection() {
  __use_projection = true;
}

/**
 * (Temporarily) disable the 3D projector without unbinding it,
 * allowing  you to mix projective 3D and regular 2D with relatively
 * little effort.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(HOMOGENEOUS);
 *       scaleProjector(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       center();
 *
 *       noProjection();
 *       setFill(`#F0F5`);
 *       poly(plane.map(v => ([50 * v[0], 50 * v[1]])));
 *
 *       useProjection();
 *       setStroke(`#333`);
 *       setFill(`#FF05`);
 *       poly(plane);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @see {@link useProjection}
 */
function noProjection() {
  __use_projection = false;
}

/**
 * Project a 3D "world" coordinate to a 2D "screen" coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(HOMOGENEOUS)
 *       scaleProjector(50);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       translate(width/2, height/4);
 *       setColor(`orange`);
 *       setStroke(`black`);
 *       // Note that this is not "useful" code, as you will
 *       // rarely, if ever, need to manually project coordinate.
 *       // In this case, you could just call `poly(plane)` instead.
 *       start();
 *       plane.forEach(p => vertex(project(...p)));
 *       vertex(project(...plane[0]));
 *       end();
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
 * Set the projector's x, y, and z axes of rotation in radians.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const cabinet = setProjector(CABINET);
 *     const homogeneous = setProjector(HOMOGENEOUS);
 *     const bottom = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *     const top = bottom.map(v => [v[0], v[1], 1]);
 *
 *     function setup() {
 *       setSize(400, 200);
 *       cabinet.setScale(50);
 *       homogeneous.setScale(50);
 *       play();
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
 *         drawAxisPoints();
 *         drawCube();
 *       });
 *     }
 *
 *     function drawAxisPoints() {
 *       setColor(`black`);
 *       point(...bottom[0]);
 *       setColor(`red`);
 *       point(...bottom[1]);
 *       setColor(`green`);
 *       point(...bottom[3]);
 *       setColor(`blue`);
 *       point(...top[0]);
 *     }
 *
 *     function drawCube() {
 *       noFill();
 *       setStroke(`red`);
 *       [bottom, top].forEach(r => {
 *         line(...r[0], ...r[1]);
 *         line(...r[2], ...r[3]);
 *       });
 *       setStroke(`green`);
 *       [bottom, top].forEach(r => {
 *         line(...r[1], ...r[2]);
 *         line(...r[3], ...r[0]);
 *       });
 *       setStroke(`blue`);
 *       [0,1,2,3].forEach(i => line(...bottom[i], ...top[i]));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} x The angle of rotation over the x axis in radians
 * @param {number} y The angle of rotation over the y axis in radians
 * @param {number} z The angle of rotation over the z axis in radians
 */
function rotateProjector(x, y, z) {
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  __projector?.setRotation(x, y, z);
}

/**
 * Set the projector's x, y, and z coordinate offsets. Note that
 * this value does *not* reset across successive draw calls. To
 * reset the translation, you must issue `translateProjector(0,0,0)`.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane1 = [
 *       [-1, -1, -1],
 *       [ 1, -1, -1],
 *       [ 1,  1, -1],
 *       [-1,  1, -1],
 *     ];
 *     const plane2 = [
 *       [-1, -1, 1],
 *       [ 1, -1, 1],
 *       [ 1,  1, 1],
 *       [-1,  1, 1],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setProjector(HOMOGENEOUS);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       center();
 *       scaleProjector(25 + 20 * sin(frame/500), 25 + 20 * sin(frame/500), 50 * sin(frame/200));
 *       setColor(`orange`);
 *       poly(plane1)
 *       setColor(`purple`);
 *       poly(plane2)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 * @param {number} s The scale factor for all three axes
 *
 * @param {number} x The scale factor for the x axis
 * @param {number} y The scale factor for the y axis
 * @param {number} z The scale factor for the z axis
 */
function scaleProjector(x, y, z) {
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  __projector?.setScale(x, y, z);
}

/**
 * Set the projector's x, y, and z coordinate offsets. Note that
 * this value does *not* reset across successive draw calls. To
 * reset the translation, you must issue `translateProjector(0,0,0)`.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const plane = [
 *       [-1, -1, 0],
 *       [ 1, -1, 0],
 *       [ 1,  1, 0],
 *       [-1,  1, 0],
 *     ];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       const p = setProjector(HOMOGENEOUS);
 *       p.setScale(50);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       center();
 *       setColor(`orange`);
 *       translateProjector(0, 0, sin(frame/100));
 *       poly(plane)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} x The offset along the x axis
 * @param {number} y The offset along the y axis
 * @param {number} z The offset along the z axis
 */
function translateProjector(x, y, z) {
  if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  __projector?.setTranslation(x, y, z);
}
