/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} r
 * @param {*} s
 * @param {*} e
 * @param {*} wedge
 */
function arc(x, y, r, s = 0, e = TAU, wedge = false) {
  start();
  if (wedge) __ctx.moveTo(x, y);
  __ctx.arc(x, y, r, s, e);
  if (wedge) __ctx.lineTo(x, y);
  end();
}

/**
 *
 * @param {*} hLabel
 * @param {*} hs
 * @param {*} he
 * @param {*} vLabel
 * @param {*} vs
 * @param {*} ve
 * @param {*} hsLabel
 * @param {*} heLabel
 * @param {*} vsLabel
 * @param {*} veLabel
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
 *
 * @param {*} points
 */
function bezier(points) {
  const [first, ...rest] = points;
  start();
  vertex(first.x, first.y);
  for (let i = 0, e = rest.length; i < e; i += 3) {
    let [p1, p2, p3] = rest.slice(i, i + 3);
    if (p1 && p2 && p3) __ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
  end();
}

/**
 *
 * @param {*} points
 * @param {*} open
 */
function bspline(points, open = true) {
  start();
  new BSpline(points, open).getLUT().forEach((p) => vertex(p.x, p.y));
  end();
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} r
 */
function circle(x, y, r) {
  arc(x, y, r);
}

/**
 *
 * @param {*} color
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
 *
 * @param {*} close
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
 *
 */
function grid() {
  save();
  setLineWidth(0.5);
  noFill();
  setStroke(__grid_color);
  for (
    let x = (-0.5 + __grid_spacing / 2) | 0;
    x < width;
    x += __grid_spacing
  ) {
    line(x, 0, x, height);
  }
  for (
    let y = (-0.5 + __grid_spacing / 2) | 0;
    y < height;
    y += __grid_spacing
  ) {
    line(0, y, width, y);
  }
  restore();
}

/**
 *
 * @param {*} img
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
async function image(img, x = 0, y = 0, w, h) {
  if (typeof img === `string`) {
    img = await new Promise((resolve, reject) => {
      const tag = document.createElement(`img`);
      tag.onload = () => resolve(tag);
      tag.onerror = () => reject();
      tag.src = img;
    });
  }
  __ctx.drawImage(img, x, y, w || img.width, h || img.height);
}

/**
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 */
function line(x1, y1, x2, y2) {
  start();
  vertex(x1, y1);
  vertex(x2, y2);
  end();
}

/**
 *
 * @param {*} f
 * @param {*} a
 * @param {*} b
 * @param {*} steps
 * @param {*} xscale
 * @param {*} yscale
 */
function plot(f, a = 0, b = 1, steps = 24, xscale = 1, yscale = 1) {
  const interval = b - a;
  start();
  for (let i = 0, e = steps - 1, x, y, v; i < steps; i++) {
    x = a + interval * (i / e);
    y = f(x);
    vertex(x * xscale, y * yscale);
  }
  end();
}

/**
 *
 * @param {*} data
 * @param {*} x
 * @param {*} y
 */
function plotData(data, x, y) {
  start();
  data.forEach((p) => vertex(p[x], p[y]));
  end();
}

/**
 *
 * @param {*} x
 * @param {*} y
 */
function point(x, y) {
  circle(x, y, 3);
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
function rect(x, y, w, h) {
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
 */
function spline(points, virtual = true, tightness = 1, T = tightness) {
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
  __ctx.moveTo(cpoints[1].x, cpoints[1].y);
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
    __ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, c3.x, c3.y);
  }
  end();
}

/**
 *
 */
function start() {
  if (__ctx.lineWidth % 2 === 1) {
    __ctx.translate(0.5, 0.5);
  }
  __ctx.beginPath();
  __first = false;
}

/**
 *
 * @param {*} str
 * @param {*} x
 * @param {*} y
 * @param {*} xalign
 * @param {*} yalign
 */
function text(str, x, y, xalign, yalign = `inherit`) {
  save();
  if (xalign) {
    setTextAlign(xalign, yalign);
  }
  __ctx.fillText(str, x, y);
  if (__textStroke) {
    setStroke(__textStroke);
    __ctx.strokeText(str, x, y);
  }
  restore();
}

/**
 *
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @param {*} x3
 * @param {*} y3
 */
function triangle(x1, y1, x2, y2, x3, y3) {
  start();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  vertex(x1, y1);
  end();
}

/**
 *
 * @param {*} x
 * @param {*} y
 */
function vertex(x, y) {
  if (__first) {
    __ctx.lineTo(x, y);
  } else {
    __first = { x, y };
    __ctx.moveTo(x, y);
  }
}
