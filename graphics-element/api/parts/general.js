/**
 *
 */
function array(len, fillFunction) {
  const arr = new Array(len).fill();
  if (fillFunction) {
    return arr.map(fillFunction);
  }
  return arr;
}

/**
 *
 */
function clearMovable() {
  __movable_points.splice(0, __movable_points.length);
}

/**
 *
 * @returns
 */
function copy() {
  const copy = document.createElement(`canvas`);
  copy.width = width;
  copy.height = height;
  const ctx = copy.getContext(`2d`);
  ctx.drawImage(__canvas, 0, 0, width, height);
  return copy;
}

/**
 *
 * @param {*} h
 * @param {*} s
 * @param {*} l
 * @param {*} a
 * @returns
 */
function color(h = __current_hue, s = 50, l = 50, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

/**
 *
 * @param {*} color
 */
function highlight(color) {
  __highlight_color = color;
  redraw();
}

/**
 *
 * @returns
 */
function millis() {
  return Date.now() - __start_time;
}

/**
 *
 */
function pause() {
  playing = false;
}

/**
 *
 */
function play() {
  playing = true;
  __draw();
}

/**
 *
 * @param {*} a
 * @param {*} cycle
 * @returns
 */
function randomColor(a = 1.0, cycle = true) {
  if (cycle) __current_hue = (__current_hue + 73) % 360;
  return `hsla(${__current_hue},50%,50%,${a})`;
}

function range(start, end, step, runFunction) {
  if (typeof step === `function`) {
    runFunction = step;
    step = (end - start) / 10;
  }
  for (let i = start; i < end; i += step) {
    runFunction(i);
  }
}

/**
 *
 * @param {*} points
 */
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

/**
 *
 */
function restore() {
  __ctx.restore();
}

/**
 * Save the canvas context.
 */
function save() {
  __ctx.save();
}

/**
 *
 * @returns
 */
function toDataURL() {
  return __canvas.toDataURL();
}

/**
 *
 * @returns
 */
function togglePlay() {
  playing ? pause() : play();
  return playing;
}
