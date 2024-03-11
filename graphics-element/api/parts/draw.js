/**
 * Draw a circular arc with radius `r` at (x,y),
 * starting at angle `s` and ending at angle `e`.
 * If `wedge` is true, this will draw a closed
 * shape that is anchored at (x,y). If omitted
 * or explicitly set to false, this will draw
 * an open shape with a fill that connects the
 * first and last point on the arc, but no closing
 * stroke.
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       arc(width/2 + 30, height/2 - 40, 40, 0, 0.66*TAU);
 *       arc(width/2 - 30, height/2 + 20, 40, 0, 0.66*TAU, true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * This function takes either separate x and y coordinates, or a single point-like
 *
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {boolean} drawWedge
 * @return void
 *
 * @param {point-like} point
 * @param {number} radius
 * @param {number} startAngle
 * @param {number} endAngle
 * @param {boolean} drawWedge
 * @return void
 */
function arc(x, y, r, s = 0, e = TAU, wedge = false) {
  if (x.x !== undefined && x.y !== undefined) {
    wedge = e;
    e = s;
    s = r;
    r = y;
    y = x.y;
    x = x.x;
  }
  const step = 0.1;
  start();
  if (wedge) vertex(x, y);
  let a = s;
  vertex(x + r * cos(s), y + r * sin(s));
  for (a = s + step; a < e; a += step) {
    vertex(x + r * cos(a), y + r * sin(a));
  }
  vertex(x + r * cos(e), y + r * sin(e));
  if (wedge) vertex(x, y);
  end();
}

/**
 * Draw a pair of horizontal and vertical axes
 *
 * @param {*} hLabel the horizontal axis label
 * @param {*} hs the start (left) value for the horizontal axis
 * @param {*} he the end (right) value for the horizontal axis
 * @param {*} vLabel the vertical axis label
 * @param {*} vs the start (top) value for the vertical axis
 * @param {*} ve the end (bottom) value for the vertical axis
 * @param {*} hsLabel an optional label for the start (left) of the horizontal axis
 * @param {*} heLabel an optional label for the end (right) of the horizontal axis
 * @param {*} vsLabel an optional label for the start (top) of the vertical axis
 * @param {*} veLabel an optional label for the end (bottom) of the vertical axis
 * @return void
 */
function axes(
  hLabel,
  hs,
  he,
  vLabel,
  vs,
  ve,
  hsLabel = false,
  heLabel = false,
  vsLabel = false,
  veLabel = false
) {
  line(hs, 0, he, 0);
  line(0, vs, 0, ve);

  const hpos = 0 - 5;
  text(`${hLabel} →`, width / 2, hpos, CENTER);
  text(hsLabel ? hsLabel : hs, hs, hpos, CENTER);
  text(heLabel ? heLabel : he, he, hpos, CENTER);

  const vpos = -5;
  text(`${vLabel}`, vpos, height / 2, RIGHT);
  text(`↓`, vpos, height / 2 + 16, RIGHT);
  text(vsLabel ? vsLabel : vs, vpos, vs + 5, RIGHT);
  text(veLabel ? veLabel : ve, vpos, ve, RIGHT);
}

/**
 * Draw one or more Bezier curves from an array
 * of Point or Point-likes that implement:
 *
 *   {
 *     x: number
 *     y: number
 *   }
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       bezier(
 *         new Point(20, height - 55),
 *         new Point(20, 25),
 *         { x: width - 20, y: 25},
 *         { x: width - 20, y: height - 55}
 *       );
 *       noFill()
 *       bezier(
 *         new Point(0, height - 20),
 *         new Point(width - 20, height - 20),
 *         { x: 20, y: 20},
 *         { x: width, y: 20}
 *       );
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} eight x, y values, followed by multiples of six
 * @return void
 *
 * @param {*} four points, followed by multiples of three
 * @return void
 */
function bezier(...args) {
  let points = args;

  if (typeof args[0] === `number`) {
    points = [];
    for (let i = 0; i < args.length; i += 2) {
      points.push({ x: args[i], y: args[i + 1] });
    }
  }

  const b = (t, a, b, c, d) => {
    const mt = 1 - t;
    return a * mt ** 3 + 3 * b * mt ** 2 * t + 3 * c * mt * t ** 2 + d * t ** 3;
  };

  let [p0, ...rest] = points;
  start();
  for (let i = 0, e = rest.length; i < e; i += 3) {
    let [p1, p2, p3] = rest.slice(i, i + 3);
    if (p1 && p2 && p3) {
      for (let t = 0; t < 1; t += 0.01) {
        vertex(b(t, p0.x, p1.x, p2.x, p3.x), b(t, p0.y, p1.y, p2.y, p3.y));
      }
      vertex(p3.x, p3.y);
      p0 = p3;
    }
  }
  end();
}

/**
 * Draw a B-spline using four or more Point or
 * Point-likes that implement:
 *
 *   {
 *     x: number
 *     y: number
 *   }
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       // CODE GOES HERE
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} eight or more x, y values
 * @return void
 *
 * @param {*} four or more points
 * @return void
 */
function bspline(...args) {
  let open = true;
  if (typeof args[args.length - 1] === `boolean`) {
    open = args.splice(args.length - 1, 1)[0];
  }

  let points = args;

  if (typeof args[0] === `number`) {
    points = [];
    for (let i = 0; i < args.length; i += 2) {
      points.push({ x: args[i], y: args[i + 1] });
    }
  }

  start();
  new BSpline(points, open).getLUT().forEach((p) => vertex(p.x, p.y));
  end();
}

/**
 * Draw a circle with radius `r` at (x,y).
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`#F002`);
 *       circle(width/2, height/2, 80);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @param {*} r
 * @return void
 *
 * @param {*} p
 * @param {*} r
 * @return void
 */
function circle(x, y, r) {
  if (x.x !== undefined && x.y !== undefined) {
    r = y;
    y = x.y;
    x = x.x;
  }
  arc(x, y, r, 0, TAU, false);
}

/**
 * Clear the canvas, and set it to a specific (CSS) colour.
 * If no `noGrid()` call was made, this will then also draw
 * the background grid.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`pink`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} colour defaults to `white`
 * @return void
 */
function clear(color = `white`) {
  save();
  __canvas.style.background = color;
  __canvas.width = width;
  __ctx = __canvas.getContext(`2d`);
  if (__draw_grid) grid();
  restore();
}

/**
 * Counterpart to start(), finalizes the current shape and
 * colours it. If `close` is true, it will close the path
 * before colouring.
 *
 * If `noFill()` is in effect, the shape will not be filled.
 * if `noStroke()` is in effect, the shape outline will not be coloured.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`gold`);
 *       start();
 *       vertex(0,height/2);
 *       vertex(width/2, 0);
 *       vertex(width, height/2);
 *       vertex(width/2, height);
 *       end(true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} close
 * @return void
 */
function end(close = false) {
  if (close) __ctx.closePath();
  __ctx.fill();
  __ctx.stroke();
  if (__ctx.lineWidth % 2 === 1) {
    __ctx.translate(-0.5, -0.5);
  }
}

/**
 * Draw an image in a given location with an optional
 * width and height. If omitted, the width and height
 * will be the image's own dimensions. Note that the
 * image may be either a URL, or an <img> element.
 *
 * Note that this is an async function: if it is important
 * that nothing gets drawn until the image has been drawn,
 * remember to `await` its call.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     async function draw() {
 *       clear(`white`);
 *       await image(`https://dummyimage.com/100x100`, 50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} img
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 * @return {Image} the drawn image
 *
 * @param {*} img
 * @param {*} p
 * @param {*} w
 * @param {*} h
 * @return {Image} the drawn image
 */
async function image(img, x = 0, y = 0, w, h) {
  if (x.x !== undefined && x.y !== undefined) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }

  if (typeof img === `string`) {
    img = await new Promise((resolve, reject) => {
      const tag = document.createElement(`img`);
      tag.onload = () => resolve(tag);
      tag.onerror = () => reject();
      tag.src = img;
    });
  }
  __ctx.drawImage(img, x, y, w || img.width, h || img.height);
  return img;
}

/**
 * Draw a line from one coordinate to another.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       range(0,height,20, (i) => line(0, 0, width, i));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @return void
 *
 * @param {*} p1
 * @param {*} p2
 * @return void
 */
function line(x1, y1, x2, y2) {
  if (x1.x !== undefined && x1.y !== undefined) {
    y2 = y1.y;
    x2 = y1.x;
    y1 = x1.y;
    x1 = x1.x;
  }

  start();
  vertex(x1, y1);
  vertex(x2, y2);
  end();
}

/**
 * Plot a y=f(x) function. The input to the function
 * will span the interval [a,b] using the indicated
 * number of steps, and the re sult may be scaled both
 * in the x and y direction in order to draw something
 * that you can actually see (e.g. if you're plotting
 * to the domain [0,1] you wouldn't be able to see the
 * result without scaling).
 *
 * This function is aware of, and will plot, discontinuities.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       noFill();
 *       setStroke(`black`);
 *       translate(0, height/2);
 *       plot((x) => cos(x)**2/sin(x), 0, TAU, width/TAU, height/2)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} f the y=f(x) function
 * @param {*} a
 * @param {*} b
 * @param {*} steps
 * @param {*} xscale
 * @param {*} yscale
 * @return void
 */
function plot(f, a = 0, b = 1, steps = (b - a) / 100, xscale = 1, yscale = 1) {
  const interval = b - a;
  start();
  let [py, dy, pdy] = [0, 0, 0];
  const step = interval / (steps - 1);
  const discontinuity = (i, x, y) => {
    end();
    save();
    noFill();
    console.log({ i, x, y, py, dy, pdy });
    point(x * xscale, py * yscale);
    point(x * xscale, y * yscale);
    restore();
    start();
  };
  for (let i = 0, x, y; i < steps; i++) {
    x = a + i * step;
    y = f(x);
    // If f(x) changes in violation of what its f'(x) suggested,
    // that's a discontinuity and we draw an asymptote.
    dy = (y - py) * step;
    if (pdy !== null && sign(y - py) !== sign(pdy) && abs(pdy) > 0.01) {
      discontinuity(i, x, y);
      pdy = null;
    } else {
      pdy = dy;
    }
    vertex(x * xscale, y * yscale);
    py = y;
  }
  end();
}

/**
 * Plot a 2D graph using a collection of any-dimensional data,
 * by indicating which dimension should be treated as the `x`
 * and which dimension should be treated as the `y`.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       noFill();
 *       translate(0, height/2);
 *
 *       setStroke(`darkgreen`);
 *       let data = array(width, (_,i) => [i, height/2 * sin(i/25)]);
 *       plotData(data, 0, 1);
 *
 *       setStroke(`purple`);
 *       data = array(width, (_,i) => ({
 *         meep: i,
 *         moop: height/2 * cos(i/25)
 *       }));
 *       plotData(data, `meep`, `moop`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} data
 * @param {*} x
 * @param {*} y
 * @return void
 */
function plotData(data, x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }

  start();
  data.forEach((p) => vertex(p[x], p[y]));
  end();
}

/**
 * Draw a point (either from x/y or point-like).
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       translate(width/2, height/2);
 *       range(0, TAU, (a) => {
 *         point(40 * cos(a), 40 * sin(a));
 *       });
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @return void
 *
 * @param {*} p
 * @return void
 */
function point(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }
  circle(x, y, 3);
}

/**
 * Draw a rectangle at the specified coordinate, with
 * the specific width and height.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`red`);
 *       rect(40, 40, width - 80, height - 80);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 * @return void
 *
 * @param {*} p
 * @param {*} w
 * @param {*} h
 * @return void
 */
function rect(x, y, w, h) {
  if (x.x !== undefined && x.y !== undefined) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }

  start();
  vertex(x, y);
  vertex(x + w, y);
  vertex(x + w, y + h);
  vertex(x, y + h);
  vertex(x, y);
  end();
}

/**
 * draw a cardinal spline with virtual start and end point
 *
 * @param {*} points
 * @param {*} virtual
 * @param {*} tightness
 * @param {*} T
 * @return void
 */
function spline(...args) {
  let points = args;
  let virtual = true;
  let T = 1;

  if (typeof args[args.length - 1] === `boolean`) {
    [virtual] = args.splice(args.length - 1, 1);
  }

  if (typeof args[args.length - 2] === `boolean`) {
    [virtual, T] = args.splice(args.length - 2, 2);
  }

  if (typeof args[0] === `number`) {
    points = [];
    for (let i = 0; i < args.length; i += 2) {
      points.push({ x: args[i], y: args[i + 1] });
    }
  }

  let cpoints = points;
  if (virtual) {
    const f0 = points[0],
      f1 = points[1],
      f2 = points[2],
      fsm = new Vector(f0.x / 2 + f2.x / 2, f0.y / 2 + f2.y / 2),
      f0r = new Vector(f0).reflect(f1),
      fsr = fsm.reflect(f1),
      fn = new Vector(f0r.x / 2 + fsr.x / 2, f0r.y / 2 + fsr.y / 2),
      l2 = points.at(-3),
      l1 = points.at(-2),
      l0 = points.at(-1),
      lsm = new Vector(l0.x / 2 + l2.x / 2, l0.y / 2 + l2.y / 2),
      l0r = new Vector(l0).reflect(l1),
      ln = new Vector(l0r.x / 2 + lsm.x / 2, l0r.y / 2 + lsm.y / 2);
    cpoints = [fn, ...points, ln];
  }

  // four point sliding window over the segment
  start();
  for (let i = 0, e = cpoints.length - 3; i < e; i++) {
    let [c1, c2, c3, c4] = cpoints.slice(i, i + 4);
    let p2 = {
      x: c2.x + (c3.x - c1.x) / (6 * T),
      y: c2.y + (c3.y - c1.y) / (6 * T),
    };
    let p3 = {
      x: c3.x - (c4.x - c2.x) / (6 * T),
      y: c3.y - (c4.y - c2.y) / (6 * T),
    };
    bezier(c2, p2, p3, c3);
  }
  end();
}

/**
 * Starts a (new) shape.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`gold`);
 *       start();
 *       vertex(0,height/2);
 *       vertex(width/2, 0);
 *       vertex(width, height/2);
 *       vertex(width/2, height);
 *       end(true);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @return void
 */
function start() {
  if (__ctx.lineWidth % 2 === 1) {
    __ctx.translate(0.5, 0.5);
  }
  __ctx.beginPath();
  __first = false;
}

/**
 * Draw some text to the screen. Its placement is
 * determined by both the coordinate provided, and
 * the x/y alignment provided. Valid `xAlign` values
 * are:
 *
 *   CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 *   END - the text anchor is on the right for LTR text, and on the left for RTL text.
 *   LEFT - the text anchor is on the left side of the text. all text is to the right.
 *   RIGHT - the text anchor is on the right side of the text. All text is to the left.
 *   START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 * Valid `yAlign` values are:
 *
 *   ALPHABETIC - standard text alignment
 *   BOTTOM - the text is aligned to the bottom of the bounding box
 *   HANGING - relevant for Tibetan and other Indic scripts.
 *   IDEOGRAPHIC - relevant for ideographic CJKV text.
 *   MIDDLE - The vertical equivalent of "center".
 *   TOP - The text is aligned to the top of the typographic "em square".
 *
 * Note that the primary text colour uses the fill colour. If text
 * stroking is enabled, the the text outline will be coloured using
 * the current stroke colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(25);
 *       text("normal text", width/2, 60, CENTER, CENTER);
 *       noFill();
 *       setTextStroke(1);
 *       text("unfilled text", width/2, 100, CENTER, CENTER);
 *       setStroke(`red`);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 140, CENTER, CENTER);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} str
 * @param {*} x
 * @param {*} y
 * @param {*} xAlign
 * @param {*} yAlign
 * @return void
 *
 * @param {*} str
 * @param {*} p
 * @param {*} xAlign
 * @param {*} yAlign
 * @return void
 */
function text(str, x, y, xAlign, yAlign) {
  if (x.x !== undefined && x.y !== undefined) {
    yAlign = xAlign;
    xAlign = y;
    y = x.y;
    x = x.x;
  }

  save();
  if (xAlign) {
    setTextAlign(xAlign, yAlign);
  }
  __ctx.fillText(str, x, y);
  if (__textStroke) {
    setStroke(__textStroke);
    __ctx.strokeText(str, x, y);
  }
  restore();
}

/**
 * Draw a triangle.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`red`);
 *       triangle(width/2, 30, 1/4 * width, 160, 3/4 * width, 110);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @param {*} x3
 * @param {*} y3
 * @return void
 *
 * @param {*} p1
 * @param {*} p2
 * @param {*} p3
 * @return void
 */
function triangle(x1, y1, x2, y2, x3, y3) {
  if (x1.x !== undefined && x1.y !== undefined) {
    y3 = x2.y;
    x3 = x2.x;
    y2 = y1.y;
    x2 = y1.x;
    y1 = x1.y;
    x1 = x1.x;
  }

  start();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  vertex(x1, y1);
  end();
}

/**
 * Add a vertex to the currently active shape.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setStroke(`black`);
 *       setFill(`red`);
 *       start();
 *       vertex(width/2, 30);
 *       vertex(1/4 * width, 160);
 *       vertex(3/4 * width, 110);
 *       end();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 * @param {*} x
 * @param {*} y
 * @return void
 *
 * @param {*} p
 * @return void
 */
function vertex(x, y) {
  if (x.x !== undefined && x.y !== undefined) {
    y = x.y;
    x = x.x;
  }
  if (__first) {
    __ctx.lineTo(x, y);
  } else {
    __first = { x, y };
    __ctx.moveTo(x, y);
  }
}
