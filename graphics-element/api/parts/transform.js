/**
 * Reset the coordinate transform matrix.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       setColor(`red`);
 *       translate(50,50);
 *       line(0,0,100,0);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       point(10,0);
 *       rotate(PI/4);
 *       point(10,0);
 *       line(0,0,100,0);
 *       setColor(`blue`);
 *       rotate(-PI/6)
 *       point(100,0);
 *       scale(0.5, 0.5);
 *       point(100,0);
 *       line(100,0,200,0);
 *       resetTransform();
 *       setColor(`black`);
 *       line(0,3,100,3);
 *       point(0,3);
 *       point(10,3);
 *       point(100,3);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function resetTransform() {
  __ctx.resetTransform();
}

/**
 * Rotate the coordinate system wrt the current origin.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       setColor(`black`);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       line(0,0,20,20);
 *       point(20,20);
 *       rotate(PI/4);
 *       line(0,0,20,20);
 *       point(20,20);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} angle
 */
function rotate(angle = 0) {
  __ctx.rotate(angle);
}

/**
 * Scale the coordinate system wrt the current origin.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       setColor(`black`);
 *       point(0,0);
 *       setColor(`darkgreen`);
 *       line(0,0,20,20);
 *       point(20,20);
 *       rotate(PI/4);
 *       scale(2);
 *       line(0,0,20,20);
 *       point(20,20);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y?
 */
function scale(x = 1, y = x) {
  __ctx.scale(x, y);
}

/**
 * Convert a screen (e.g. browser) coordinate into its
 * corresponding "transformed" coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       noGrid();
 *     }
 *     function draw() {
 *       clear(`lightgrey`);
 *       translate(width/2, height/2);
 *       rotate(PI/4);
 *       scale(0.5);
 *       if (pointer.active) {
 *         setColor(`red`);
 *         point(pointer.x, pointer.y);
 *         setColor(`blue`);
 *         point(screenToWorld(pointer.x, pointer.y));
 *       }
 *     }
 *     function pointerMove() {
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @returns p
 * 
 * @param {*} p
 * @returns p
 */
function screenToWorld(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }

  let M = __ctx.getTransform().invertSelf();

  return new Point(x * M.a + y * M.c + M.e, x * M.b + y * M.d + M.f);
}

/**
 * Set the current transform matrix, based on applying:
 *
 *       | a b c |
 *   m = | d e f |
 *       | 0 0 1 |
 *
 * With the parameters defaulting to the identity matrix.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @param {number} f
 */
function transform(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0) {
  __ctx.transform(a, b, c, d, e, f);
}

/**
 * Translate the coordinate system by some amount of x and y units.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       point(0,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * -or-
 * @param {*} p
 */
function translate(x = 0, y = 0) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }
  __ctx.translate(x, y);
}

/**
 * Convert an in-canvas "transformed" coordinate into its
 * corresponding "screen" (i.e. browser canvas offset) coordinate.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       play();
 *     }
 *     function draw() {
 *       clear();
 *       translate(width / 2, height / 2);
 *       rotate(millis() / 2000);
 *       const p = new Point(30, 0);
 *       const s = worldToScreen(p);
 *       setFontSize(25);
 *       point(p);
 *       text(`${p.x},${p.y}`, p.x + 10, p.y + 10);
 *       resetTransform();
 *       setFontSize(16);
 *       text(`${s.x.toFixed()},${s.y.toFixed()}`, s.x - 25, s.y - 15);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @return p
 *
 * @param {*} p
 * @return p
 */
function worldToScreen(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }

  let M = __ctx.getTransform();

  return new Point(x * M.a + y * M.c + M.e, x * M.b + y * M.d + M.f);
}
