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
const MIDDLE = `middle`;
const POINTER = `default`;
const RIGHT = `right`;
const START = `start`;
const TOP = `top`;
const TOP_LEFT = `top-left`;
const TOP_RIGHT = `top-right`;

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
let __last_frame;
let __movable_points;
let __projector;
let __redrawing;
let __shape;
let __start_time;
let __style_stack;
let __textStroke;
let __use_projection;

const __prng = new (class {
  constructor(seed = Date.now()) {
    this.a = seed;
  }
  reseed(seed) {
    this.a = seed;
  }
  next() {
    // SplitMix32, https://stackoverflow.com/a/47593316/740553
    let { a } = this;
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    this.a = a;
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  }
})();

async function __reset(element = __element) {
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
  __projector = false;
  __redrawing = false;
  __shape = undefined;
  __start_time = Date.now();
  __style_stack = [];
  __textStroke = `transparent`;
  __use_projection = false;

  currentMovable = false;
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

function __halt() {
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
