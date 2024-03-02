const ALPHABETIC = `alphabetic`;
const AUTO = `auto`;
const BOTTOM = `bottom`;
const BOTTOM_LEFT = `botton-left`;
const BOTTOM_RIGHT = `bottom-right`;
const CENTER = `center`;
const CONSTRAIN = true;
const CROSS = `crosshair`;
const END = `end`;
const HAND = `pointer`;
const HANGING = `hanging`;
const IDEOGRAPHIC = `ideographic`;
const LEFT = `left`;
const LTR = `ltr`;
const MIDDLE = `middle`;
const POINTER = `default`;
const RIGHT = `right`;
const RTL = `rtl`;
const START = `start`;
const TOP = `top`;
const TOP_LEFT = `top-left`;
const TOP_RIGHT = `top-right`;

const pointer = { x: 0, y: 0 };
const keyboard = {};

// math functions and constants
const {
  abs,
  acos,
  acosh,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  cbrt,
  ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  floor,
  fround,
  hypot,
  imul,
  log: ln,
  log10: log,
  log2,
  max,
  min,
  pow,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  trunc,
} = Math;

const { PI, E } = Math;

function constrain(v, s, e) {
  return v < s ? s : v > e ? e : v;
}

function csc(v) {
  return 1 / sin(v);
}

function ctn(v) {
  return cos(v) / sin(v);
}

function degrees(v, constrain) {
  let d = (v / PI) * 180;
  if (!constrain) return d;
  while (d < 0) d += 360;
  return d % 360;
}

function dist(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

const epsilon = 1e-10;

const huge = 1_000_000;

function map(v, s, e, ns, ne, constrained = false) {
  const i1 = e - s,
    i2 = ne - ns,
    p = v - s;
  let r = ns + (p * i2) / i1;
  if (constrained) return constrain(r, ns, ne);
  return r;
}

function radians(v) {
  let r = (v / 180) * PI;
  if (!constrain) return r;
  while (r < 0) r += TAU;
  return r % TAU;
}

function random(a = 1, b) {
  if (b === undefined) return a * Math.random();
  return a + Math.random() * (b - a);
}

const sec = (v) => 1 / cos(v);

const TAU = PI * 2;

// "public" vars
let currentPoint;
let frame;
let frameDelta;
let height;
let width;
let playing;

// "internal" vars

let __canvas = document.createElement(`canvas`);
__canvas.tabIndex = 0;
__canvas.addEventListener(`pointerdown`, () => __canvas.focus());
let __ctx = __canvas.getContext(`2d`);

let __current_cursor;
let __current_highlight_color;
let __current_hue;
let __draw_grid;
let __drawing;
let __element;
let __finished_setup;
let __first;
let __font;
let __grid_color;
let __grid_spacing;
let __highlight_color;
let __movable_points;
let __redrawing;
let __start_time;
let __style_stack;
let __textStroke;
let __last_frame;

function find(qs) {
  return __element.querySelector(qs);
}

function findAll(qs) {
  return __element.querySelectorAll(qs);
}

async function reset(element = __element) {
  __element = element;

  // default variable values
  __current_cursor = `auto`;
  __current_highlight_color = `rgb(0,254,124)`;
  __current_hue = 0;
  __draw_grid = true;
  __drawing = false;
  __finished_setup = false;
  __font = { family: `sans-serif`, size: 16, weight: 400 };
  __grid_color = `lightgrey`;
  __grid_spacing = 20;
  __highlight_color = false;
  __movable_points = [];
  __redrawing = false;
  __start_time = Date.now();
  __style_stack = [];
  __textStroke = `transparent`;

  currentPoint = false;
  playing = false;
  frame = 0;
  pointer.x = 0;
  pointer.y = 0;
  Object.getOwnPropertyNames(keyboard).forEach((n) => delete keyboard[n]);

  // make sure we don't double-generate these:
  clearSliders();
  clearButtons();

  // run setup
  await __setup();
  __finished_setup = true;

  // run first draw
  __last_frame = Date.now();
  await __draw();

  return { width, height };
}

function halt() {
  playing = false;
  __canvas = undefined;
  __ctx = undefined;
  __finished_setup = false;
  __drawing = true;
  __redrawing = true;
  __first = undefined;
  __movable_points = undefined;
  __current_cursor = undefined;
  __current_hue = 0;
  __font = undefined;
  __start_time = 0;
  clearSliders();
  clearButtons();
}

function __getDescription() {
  if (typeof getDescription !== `undefined`) return getDescription();
}

async function __setup() {
  if (typeof setup !== `undefined`) await setup();
  if (typeof __more_setup !== `undefined`) await __more_setup();
  if (!width && !height) setSize();
}

function setSize(w = 400, h = 200) {
  width = __canvas.width = w;
  height = __canvas.height = h;
  __element.style.maxWidth = `calc(2em + ${width}px`;
  __ctx = __canvas.getContext(`2d`);
  __draw();
}

async function __draw() {
  if (!__finished_setup) return;
  if (!__drawing) {
    __drawing = true;
    const now = Date.now();
    frameDelta = now - __last_frame;
    frame++;
    resetTransform();
    if (typeof draw !== `undefined`) await draw();
    if (typeof __more_draw !== `undefined`) await __more_draw();
    __drawing = false;
    __last_frame = now;
    if (playing) requestAnimationFrame(() => __draw());
  }
}

function redraw() {
  if (__redrawing) return;
  if (playing) return;
  __redrawing = true;
  __draw();
  __redrawing = false;
}

// ----------------- pointer helpers ---------------------

function __checkForCurrentPoint(x, y, type) {
  const matches = [];
  const matchPadding = type.includes(`mouse`) ? 10 : 30;
  __movable_points.forEach((p, pos) => {
    let x2 = p[0] === undefined ? p.x : p[0];
    let y2 = p[1] === undefined ? p.y : p[1];
    const d = dist(x, y, x2, y2);
    if (d < (p.r ? p.r : 0) + matchPadding) {
      matches.push({ p, d });
    }
  });
  currentPoint = false;
  __canvas.style.cursor = `auto`;
  if (matches.length) {
    matches.sort((a, b) => a.d - b.d);
    currentPoint = matches[0].p;
    __canvas.style.cursor = `pointer`;
  }
}

function __toPointerEvent(evt) {
  let pointer = evt;
  // Convert mouse or touch into generic pointer. Which we need
  // to do because Chrome on MacOS has decided to not generate
  // pointer events when there's a mouse. Thanks Google!
  if (evt.type.includes(`touch`)) {
    const { touches, changedTouches } = evt.originalEvent ?? evt;
    pointer = touches[0] ?? changedTouches[0];
  }
  const { clientX, clientY } = pointer;
  const { left, top } = __canvas.getBoundingClientRect();
  return { offsetX: clientX - left, offsetY: clientY - top };
}

// --------------- pointer event handling -------------------

function __pointerDown(x, y) {
  if (currentPoint) {
    currentPoint._dx = currentPoint.x - x;
    currentPoint._dy = currentPoint.y - y;
  }
  if (typeof pointerDown !== `undefined`) pointerDown(x, y);
}

[`touchstart`, `mousedown`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type, down: true, mark: { x, y } });
      __checkForCurrentPoint(x, y, type);
      __pointerDown(x, y);
    }
  });
});

function __pointerUp(x, y) {
  if (typeof pointerUp !== `undefined`) pointerUp(x, y);
  if (pointer.mark?.x === x && pointer.mark?.y === y) {
    if (typeof pointerClick !== `undefined`) pointerClick(x, y);
  }
}

[`touchend`, `mouseup`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type, down: false, mark: false });
      __pointerUp(x, y);
    }
  });
});

function __pointerMove(x, y) {
  let pointMoved = false;
  if (pointer.down && currentPoint) {
    if (currentPoint[0]) {
      currentPoint[0] = x + currentPoint._dx;
      currentPoint[1] = y + currentPoint._dy;
    } else {
      currentPoint.x = x + currentPoint._dx;
      currentPoint.y = y + currentPoint._dy;
    }
    pointMoved = true;
  }

  if (typeof pointerMove !== `undefined`) {
    pointerMove(x, y);
    pointer.drag = false;
    if (pointer.down && typeof pointerDrag !== `undefined`) {
      pointer.drag = true;
      pointerDrag(x, y);
    }
  }
  if (pointMoved && !playing) redraw();
}

[`touchmove`, `mousemove`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type });
      if (!pointer.down) __checkForCurrentPoint(x, y, type);
      __pointerMove(x, y);
    }
  });
});

function __pointerActive(active) {
  if (typeof pointerActive !== `undefined`) {
    pointerActive(active);
  }
}

[`touchstart`, `mouseenter`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    pointer.active = true;
    __pointerActive(true);
  });
});

[`touchend`, `mouseleave`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    pointer.active = false;
    __pointerActive(false);
  });
});

// ------------------ key event handling ----------------------

function __safelyInterceptKey(evt) {
  // We don't want to interfere with the browser, so we're only
  // going to allow unmodified keys, or shift-modified keys,
  // and tab has to always work. For obvious reasons.
  const tab = evt.key !== "Tab";
  const functionKey = evt.key.match(/F\d+/) === null;
  const specificCheck = tab && functionKey;
  if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && specificCheck) {
    if (evt.target === __canvas) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
}

function __keyDown(key, shiftKey, altKey, ctrlKey, metaKey) {
  keyboard[key] = Date.now();
  if (typeof keyDown !== `undefined`)
    keyDown(key, shiftKey, altKey, ctrlKey, metaKey);
}

__canvas.addEventListener(`keydown`, (evt) => {
  __safelyInterceptKey(evt);
  const { key, shiftKey, altKey, ctrlKey, metaKey } = evt;
  if (__finished_setup) __keyDown(key, shiftKey, altKey, ctrlKey, metaKey);
});

function __keyUp(key, shiftKey, altKey, ctrlKey, metaKey) {
  delete keyboard[key];
  if (typeof keyUp !== `undefined`)
    keyUp(key, shiftKey, altKey, ctrlKey, metaKey);
}

__canvas.addEventListener(`keyup`, (evt) => {
  __safelyInterceptKey(evt);
  const { key, shiftKey, altKey, ctrlKey, metaKey } = evt;
  if (__finished_setup) __keyUp(key, shiftKey, altKey, ctrlKey, metaKey);
});

// ---------------- slider functions ---------------------

function addSlider(propLabel, assign, options = {}) {
  let {
    min,
    max,
    step,
    value,
    classes = `slider`,
    transform = (v) => v,
  } = options;

  min = min === undefined ? 0 : min;
  max = max === undefined ? 1 : max;
  step = step === undefined ? (max - min) / 10 : step;
  value = value === undefined ? (max - min) / 2 : value;

  // custom "rounding", purely for strings
  const round = (v, d = 4) => {
    v = `${v}`;
    const fs = v.indexOf(`.`);
    if (fs !== -1) {
      let prec = d - fs > 0 ? d - fs : 0;
      v = v.substring(0, fs + prec);
    }
    return v;
  };

  const create = (tag) => document.createElement(tag);

  let slider = create(`input`);
  slider.type = `range`;
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.setAttribute(`value`, value);
  slider.setAttribute(`class`, classes);

  const update = ({ value }) => {
    valueField.textContent = round(value);
    assign(transform(parseFloat(value)));
    if (!playing) redraw();
  };

  slider.addEventListener(`input`, ({ target }) => update(target));

  let table = __element.querySelector(`table.slider-wrapper`);
  if (!table) {
    table = create(`table`);
    table.classList.add(`slider-wrapper`);
    __element.prepend(table);
  }
  let tr = create(`tr`);

  let td = create(`td`);
  let label = create(`label`);
  label.classList.add(`slider-label`);
  label.innerHTML = propLabel
    .replace(/_(.+)$/, `<sub>$1</sub>`)
    .replace(/(\d+)/, `<sub>$1</sub>`);
  td.append(label);
  tr.append(td);

  td = create(`td`);
  td.classList.add(`slider-min`);
  td.textContent = round(slider.min);
  tr.append(td);

  td = create(`td`);
  td.width = `*`;
  td.append(slider);
  tr.append(td);

  td = create(`td`);
  td.classList.add(`slider-max`);
  td.textContent = round(slider.max);
  tr.append(td);

  td = create(`td`);
  var valueField = create(`label`); // function scoped
  valueField.classList.add(`slider-value`);
  td.append(valueField);
  tr.append(td);
  td.addEventListener(`pointerdown`, () => {
    const value = prompt(`new value?`, slider.value);
    if (value !== null) {
      slider.value = value;
      update({ value });
    }
  });

  table.append(tr);

  update(slider);
  return slider;
}

function clearSliders() {
  const table = __element.querySelector(`table.slider-wrapper`);
  if (table) table.innerHTML = ``;
}

function addButton(label, onClick) {
  const btn = document.createElement(`button`);
  btn.classList.add(`graphics-element-button`);
  btn.textContent = label;
  btn.addEventListener(`click`, () => onClick(btn));
  __element.prepend(btn);
  return btn;
}

function clearButtons() {
  __element
    .querySelectorAll(`button.graphics-element-button`)
    .forEach((e) => e.remove());
}

// ---------- general functions -------------

function clearMovable() {
  __movable_points.splice(0, __movable_points.length);
}

function copy() {
  const copy = document.createElement(`canvas`);
  copy.width = width;
  copy.height = height;
  const ctx = copy.getContext(`2d`);
  ctx.drawImage(__canvas, 0, 0, width, height);
  return copy;
}

function color(h = __current_hue, s = 50, l = 50, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

function highlight(color) {
  __highlight_color = color;
  redraw();
}

function millis() {
  return Date.now() - __start_time;
}

function pause() {
  playing = false;
}

function play() {
  playing = true;
  __draw();
}

function randomColor(a = 1.0, cycle = true) {
  if (cycle) __current_hue = (__current_hue + 73) % 360;
  return `hsla(${__current_hue},50%,50%,${a})`;
}

function setMovable(points) {
  // TODO: shapes
  if (!points.forEach) {
    points = [points];
  }
  points.forEach((p) => {
    if (__movable_points.indexOf(p) === -1) {
      __movable_points.push(p);
    }
  });
}

function restore() {
  __ctx.restore();
}

/**
 * Save the canvas context.
 */
function save() {
  __ctx.save();
}

function toDataURL() {
  return __canvas.toDataURL();
}

function togglePlay() {
  playing ? pause() : play();
  return playing;
}

// ---------- draw functions -------------

function arc(x, y, r, s = 0, e = TAU, wedge = false) {
  start();
  if (wedge) __ctx.moveTo(x, y);
  __ctx.arc(x, y, r, s, e);
  if (wedge) __ctx.lineTo(x, y);
  end();
}

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

function bspline(points, open = true) {
  start();
  new BSpline(points, open).getLUT().forEach((p) => vertex(p.x, p.y));
  end();
}

function circle(x, y, r) {
  arc(x, y, r);
}

function clear(color = `white`) {
  save();
  __canvas.style.background = color;
  __canvas.width = width;
  __ctx = __canvas.getContext(`2d`);
  if (__draw_grid) grid();
  restore();
}

function end(close = false) {
  if (close) __ctx.closePath();
  __ctx.fill();
  __ctx.stroke();
  if (__ctx.lineWidth % 2 === 1) {
    __ctx.translate(-0.5, -0.5);
  }
}

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

function line(x1, y1, x2, y2) {
  start();
  vertex(x1, y1);
  vertex(x2, y2);
  end();
}

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

function plotData(data, x, y) {
  start();
  data.forEach((p) => vertex(p[x], p[y]));
  end();
}

function point(x, y) {
  circle(x, y, 3);
}

function rect(x, y, w, h) {
  start();
  vertex(x, y);
  vertex(x + w, y);
  vertex(x + w, y + h);
  vertex(x, y + h);
  vertex(x, y);
  end();
}

// draw a cardinal spline with virtual start and end point
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

function start() {
  if (__ctx.lineWidth % 2 === 1) {
    __ctx.translate(0.5, 0.5);
  }
  __ctx.beginPath();
  __first = false;
}

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

function triangle(x1, y1, x2, y2, x3, y3) {
  start();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  vertex(x1, y1);
  end();
}

function vertex(x, y) {
  if (__first) {
    __ctx.lineTo(x, y);
  } else {
    __first = { x, y };
    __ctx.moveTo(x, y);
  }
}

// ---------- transform functions -------------

function resetTransform() {
  __ctx.resetTransform();
}

function rotate(angle = 0) {
  __ctx.rotate(angle);
}

function scale(x = 1, y = x) {
  __ctx.scale(x, y);
}

function screenToWorld(x, y) {
  if (y === undefined) {
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

function translate(x = 0, y = 0) {
  __ctx.translate(x, y);
}

function worldToScreen(x, y) {
  if (y === undefined) {
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

// ---------------- setters -------------------

function setBorder(width = 1, color = `black`) {
  if (!width) {
    __canvas.style.border = `none`;
  } else {
    __canvas.style.border = `${width}px solid ${color}`;
  }
}

function setColor(color) {
  setFill(color);
  setStroke(color);
}

function setCrisp(enabled = true) {
  __canvas.classList.toggle(`crisp`, enabled);
}

function setCursor(type) {
  __current_cursor = type;
  __canvas.style.cursor = __current_cursor;
}

function setFill(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.fillStyle = color;
}

function setFont(font) {
  __ctx.font = font || `${__font.weight} ${__font.size}px ${__font.family}`;
}

function setFontFamily(name) {
  __font.family = name;
  setFont();
}
function setFontSize(px) {
  __font.size = px;
  setFont();
}

function setFontWeight(val) {
  __font.weight = val;
  setFont();
}

function setGrid(spacing = 20, color = `lightgrey`) {
  __draw_grid = true;
  __grid_spacing = spacing;
  __grid_color = color;
}

function setHighlightColor(color) {
  __current_highlight_color = color;
}

function setLineDash(...values) {
  __ctx.setLineDash(values);
}

function setLineWidth(width = 1) {
  __ctx.lineWidth = width;
}

function setStroke(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.strokeStyle = color;
}

function setTextAlign(xAlign, yAlign = ALPHABETIC) {
  __ctx.textAlign = xAlign;
  __ctx.textBaseLine = yAlign;
}

function setTextDirection(dir = `inherit`) {
  __ctx.direction = dir;
}

function setTextStroke(color, width) {
  __textStroke = color;
  setLineWidth(width);
}

// ---------------- "no ..." -------------------

function noBorder() {
  setBorder(false);
}

function noColor() {
  noFill();
  noStroke();
}

function noCursor() {
  __canvas.style.cursor = `none`;
}

function noFill() {
  setFill(`transparent`);
}

function noGrid() {
  __draw_grid = false;
}

function noLineDash() {
  __ctx.setLineDash([]);
}

function noMarging() {
  setMargin(0);
}

function noShadow() {
  setShadow(`transparent`, 0);
}

function noStroke() {
  setStroke(`transparent`);
}

function noTextStroke() {
  setTextStroke(false, undefined);
}
