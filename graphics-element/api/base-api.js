/**
 * The base API class, responsible for such things as setting up canvas event
 * handling, method accumulation, custom element binding, etc. etc.
 *
 * Basically if it's not part of the "public" API, it's in this class.
 */
class BaseAPI {
  static get privateMethods() {
    return [
      `constructor`,
      `createHatchPatterns`,
      `addListeners`,
      `setCursorCoords`,
    ]
      .concat(this.superCallers)
      .concat(this.eventHandlers);
  }

  static get superCallers() {
    return [`setup`, `draw`];
  }

  static get eventHandlers() {
    return [`onMouseDown`, `onMouseMove`, `onMouseUp`, `onKeyDown`, `onKeyUp`];
  }

  static get methods() {
    const priv = this.privateMethods;
    const names = Object.getOwnPropertyNames(this.prototype).concat([
      `setSize`,
      `redraw`,
    ]);
    return names.filter((v) => priv.indexOf(v) < 0);
  }

  /**
   *
   */
  constructor(
    uid,
    width = 200,
    height = 200,
    canvasBuildFunction, // Only used during image generation, not used in the browser
    customDataSet //      "                                               "
  ) {
    if (uid) {
      this.element = window[uid];
      delete window[uid];
      this.dataset = this.element.dataset;
    }
    if (canvasBuildFunction) {
      const { canvas, ctx } = canvasBuildFunction(width, height);
      this.canvas = canvas;
      this.ctx = ctx;
      this.preSized = true;
    } else {
      this.canvas = document.createElement(`canvas`);
    }
    if (!this.dataset) {
      if (customDataSet) {
        this.dataset = customDataSet;
      } else {
        this.dataset = {};
      }
    }
    Object.defineProperty(this, `parameters`, {
      writable: false,
      configurable: false,
      value: Object.fromEntries(
        Object.entries(this.dataset)
          .map((pair) => {
            let name = pair[0];
            let v = pair[1];
            if (v === `null` || v === `undefined`) return [];
            if (v === `true`) return [name, true];
            else if (v === `false`) return [name, false];
            else {
              let d = parseFloat(v);
              // Use == to evaluate "is this a string number"
              if (v == d) return [name, d];
            }
            return [name, v];
          })
          .filter((v) => v.length)
      ),
    });
    this.addListeners();
    this.setSize(width, height);
    this.currentPoint = false;
    this.frame = 0;
    const now = performance.now();
    this.setup();
    this.__ready_to_draw = true;
    this.__lastFrameTime = now;
    this.draw();
  }

  /**
   *
   */
  addListeners() {
    const canvas = this.canvas;

    if (this.element) {
      this.element.setGraphic(this);
    }

    this.cursor = {};

    const root = typeof document !== "undefined" ? document : canvas;

    [`touchstart`, `mousedown`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onMouseDown(evt))
    );

    [`touchmove`, `mousemove`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => {
        this.onMouseMove(evt);
      })
    );

    [`touchend`, `mouseup`].forEach((evtName) =>
      root.addEventListener(evtName, (evt) => this.onMouseUp(evt))
    );

    this.keyboard = {};

    [`keydown`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onKeyDown(evt))
    );

    [`keyup`].forEach((evtName) =>
      canvas.addEventListener(evtName, (evt) => this.onKeyUp(evt))
    );
  }

  stopEvent(evt) {
    if (evt.target === this.canvas) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }

  /**
   *
   */
  setCursorCoords(evt) {
    this.cursor.x = evt.offsetX;
    this.cursor.y = evt.offsetY;
  }

  /**
   *
   */
  onMouseDown(evt) {
    this.stopEvent(evt);
    this.cursor.down = true;
    this.setCursorCoords(evt);
  }

  /**
   *
   */
  onMouseMove(evt) {
    this.stopEvent(evt);
    this.setCursorCoords(evt);
  }

  /**
   *
   */
  onMouseUp(evt) {
    this.stopEvent(evt);
    this.cursor.down = false;
  }

  /**
   *
   */
  safelyInterceptKey(evt) {
    // We don't want to interfere with the browser, so we're only
    // going to allow unmodified keys, or shift-modified keys,
    // and tab has to always work. For obvious reasons.
    const tab = evt.key !== "Tab";
    const functionKey = evt.key.match(/F\d+/) === null;
    const specificCheck = tab && functionKey;
    if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && specificCheck) {
      this.stopEvent(evt);
    }
  }

  /**
   *
   */
  onKeyDown(evt) {
    this.safelyInterceptKey(evt);
    // FIXME: Known bug: this approach means that "shift + r + !shift + !r" leaves "R" set to true
    this.keyboard[evt.key] = true;
    this.keyboard.currentKey = evt.key;
  }

  /**
   *
   */
  onKeyUp(evt) {
    this.safelyInterceptKey(evt);
    // FIXME: Known bug: this approach means that "shift + r + !shift + !r" leaves "R" set to true
    this.keyboard[evt.key] = false;
    this.keyboard.currentKey = evt.key;
  }

  /**
   * This function is critical in correctly sizing the canvas.
   */
  setSize(w, h) {
    this.width = w || this.width;
    this.height = h || this.height;
    this.element.style.setProperty(`--width`, this.width);
    this.element.style.setProperty(`--height`, this.height);
    if (!this.preSized) {
      this.canvas.width = this.width;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext(`2d`);
    }
  }

  /**
   * This is the main entry point.
   */
  setup() {
    // console.log(`setup`);
    this.movable = [];
    this.font = {
      size: 10,
      weight: 400,
      family: `arial`,
    };
  }

  /**
   * This is the draw (loop) function.
   */
  draw() {
    if (!this.__ready_to_draw) return;
    this.frame++;
    // console.log(`draw`);
  }

  /**
   * This is mostly a safety function, to
   * prevent direct calls to draw().. it might
   * disappear.
   */
  redraw() {
    if (!this.__ready_to_draw) return;
    if (!this.playing && !this.redrawing) {
      this.redrawing = true;
      this.draw();
      this.redrawing = false;
    }
  }
}

export { BaseAPI };