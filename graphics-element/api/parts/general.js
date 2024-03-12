/**
 * Create an array of specified length, optionally
 * filled using the same kind of function you'd normall
 * use with .map()
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       noFill();
 *       translate(0, height/2);
 *       let data = array(width, (_,i) => [i, height/2 * sin(i/25)]);
 *       plotData(data, 0, 1);
 *      }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} length The size of the array you want
 * @param {function} fillFunction? The optional function that gets used to fill the array
 */
function array(len, fillFunction) {
  const arr = new Array(len).fill();
  if (fillFunction) {
    return arr.map(fillFunction);
  }
  return arr;
}

/**
 * Empty the list of movable points in your graphic.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`lock`, () => {
 *         clearMovable();
 *         redraw();
 *       });
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       for(let p of points) {
 *         setColor(isMovable(p) ? `red` : `grey`);
 *         point(p);
 *       }
 *     }
 *
 *     function pointerDown(x,y) {
 *       if (currentPoint) return;
 *       const p = new Point(x,y);
 *       points.push(p);
 *       setMovable(p);
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function clearMovable() {
  __movable_points.splice(0, __movable_points.length);
}

/**
 * Create a copy of the current canvas element
 * for use somewhere else in your own code.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`pink`);
 *     }
 *
 *     function pointerDown(x,y) {
 *       document.dispatchEvent(
 *         new CustomEvent(`graphics:update`, {
 *           detail: {
 *             canvas: copy()
 *           }
 *         })
 *       );
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @returns {HTMLCanvasElement} A copy of the current canvas
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
 * Generates a color based on the HSL color space.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(color(45, 80, 90));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} hue in the range [0, 360]
 * @param {number} saturation in the range [0, 100]
 * @param {number} lightness in the range [0, 100]
 * @param {number} opacity in the range [0, 1]
 * @returns {string} A CSS hsla color string
 */
function color(h = __current_hue, s = 50, l = 50, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

/**
 * Mark a specific color as the highlight color,
 * which causes the graphic to redraw with that
 * color replaced by whichever color you picked
 * as highlight color.
 *
 * Note that you can only use named (CSS) colors
 * with this function.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setHighlightColor(`lime`);
 *     }
 *
 *     function draw() {
 *       clear();
 *       setColor(`red`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       text("let's go", width/2, height/2)
 *     }
 *
 *     function pointerActive(state) {
 *       if (state) highlight(`red`);
 *       else highlight(false);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {color|boolean} color Set the color that should get replaced with the highlight color, or disable highlight when color is `false`
 */
function highlight(color) {
  if (CSS_COLOR_MAP[color]) {
    __highlight_color = CSS_COLOR_MAP[color];
  } else {
    __highlight_color = color;
  }
  redraw();
}

/**
 * Check whether a point is registered as movable.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`lock`, () => {
 *         clearMovable();
 *         redraw();
 *       });
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       for(let p of points) {
 *         setColor(isMovable(p) ? `red` : `grey`);
 *         point(p);
 *       }
 *     }
 *
 *     function pointerDown(x,y) {
 *       if (currentPoint) return;
 *       const p = new Point(x,y);
 *       points.push(p);
 *       setMovable(p);
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {PointLike} The point that we want to check "movability" for
 * @returns {boolean} True if our point is in the list of movable points, otherwise false
 */
function isMovable(point) {
  return __movable_points.includes(point);
}

/**
 * Get the number of milliseconds that this
 * graphic has been running.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000)|0;
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @returns {number} number of milliseconds since the graphic loaded in
 */
function millis() {
  return Date.now() - __start_time;
}

/**
 * Pause the graphic if its currently playing.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *
 *     function pointerActive(state) {
 *       if(state) {
 *         pause();
 *       } else {
 *         play();
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function pause() {
  playing = false;
}

/**
 * Start playing your graphic, meaning it will call draw()
 * at whatever rate the requestAnimationFrame loop is
 * allowed to run on your computer.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     let fps = 0;
 *     let checked = false;
 *     let lastFrameCheck = 0;
 *
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`fps: ${fps}`, width/2, height/2)
 *       if (seconds.endsWith(`.0`)) {
 *         if (!checked) {
 *           checked = true;
 *           fps = frame - lastFrameCheck;
 *           lastFrameCheck = frame;
 *         }
 *       } else {
 *         checked = false;
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function play() {
  playing = true;
  __draw();
}

/**
 * Generate a random colour. Note that this function
 * allows you to get "the currently generated random
 * colour" in different opacities by calling the function
 * with an opacity value, and `false` as cycle argument.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(randomColor());
 *     }
 *
 *     function pointerDown() {
 *       redraw();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 * @param {number} opacity The opacity value in the range [0,1]
 * @param {number} cycle? A boolean that indicates whether or not to move on to the next colour (default = true)
 */
function randomColor(a = 1.0, cycle = true) {
  if (cycle) __current_hue = (__current_hue + 73) % 360;
  return `hsla(${__current_hue},50%,50%,${a})`;
}

/**
 * An alternative to writing for loops, because
 * no one wants to constantly write var allocations
 * that only live for the duration of a loop.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       translate(width/2, height/2);
 *       range(0, TAU, (a) => point(40 * cos(a), 40 * sin(a)));
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 *
 * @param {number} start The equivalent of a for loop's initial `let i = ...`
 * @param {number} end The equivalent of a for loop's `i < end`
 * @param {number} step? The step size by which to increment at each iteration (defaults = `(start-end)/10`)
 * @param {function} runFunction The function to run at each iteration
 */
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
 * Mark one or more points as movable, meaning
 * that the user can reposition the point around on
 * the canvas by touch/click-dragging.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *
 *     function setup() {
 *       setSize(200, 200);
 *       for (let i = 40; i < 200; i += 20) {
 *         points.push(new Point(i - 20, 120));
 *       }
 *       setMovable(...points);
 *     }
 *
 *     function draw() {
 *       clear();
 *       noFill();
 *       setStroke(`purple`);
 *       bspline(...points);
 *       for(let p of points) point(p);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {PointLike[n]} points One or more points to mark as movable.
 */
function setMovable(...points) {
  points.forEach((p) => {
    if (__movable_points.indexOf(p) === -1) {
      __movable_points.push(p);
    }
  });
}

/**
 * Restore the graphics context (transforms,
 * current colors, etc) to what they were
 * when save() was called.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       setColor(`blue`);
 *       line(0,0,80,0);
 *       save();
 *       setColor(`darkgreen`)
 *       range(0, 5, 1, (a) => {
 *         rotate(PI/8);
 *         line(0,0,80,0);
 *       });
 *       restore();
 *       line(-20,0,-80,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function restore() {
  __ctx.restore();
}

/**
 * Save the current graphics context (transforms,
 * current colors, etc) so that those can be restored
 * after changing them.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const points = [];
 *
 *     function draw() {
 *       clear();
 *       translate(width/2, height/2);
 *       setColor(`blue`);
 *       line(0,0,80,0);
 *       save();
 *       setColor(`darkgreen`)
 *       range(0, 5, 1, (a) => {
 *         rotate(PI/8);
 *         line(0,0,80,0);
 *       });
 *       restore();
 *       line(-20,0,-80,0);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function save() {
  __ctx.save();
}

/**
 * Convert the current canvas into an data URL
 * that represents a PNG image.
 * @returns {string} The current canvas as PNG data URL
 */
function toDataURL() {
  return __canvas.toDataURL();
}

/**
 * If the graphic is currently playing, pause it,
 * and if it's paused, play it.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setColor(`black`);
 *       play();
 *     }
 *
 *     function draw() {
 *       clear();
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       const seconds = (millis()/1000).toFixed(1);
 *       text(`${seconds}s`, width/2, height/2)
 *     }
 *
 *     function pointerActive(state) {
 *       togglePlay();
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @returns {boolean} The new play state
 */
function togglePlay() {
  playing ? pause() : play();
  return playing;
}
