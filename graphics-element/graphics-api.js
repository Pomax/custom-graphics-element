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
