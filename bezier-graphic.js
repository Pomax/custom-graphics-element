import { CustomElement } from "./custom-element.js";
import { GraphicsAPI } from "./graphics-api.js";
import { INSTANCE_KEY } from "./keys.js";

/**
 * A simple "for programming code" element, for holding entire
 * programs, rather than code snippets.
 */
CustomElement.register(class ProgramCode extends HTMLElement {});

/**
 * Our custom element
 */
class BezierGraphic extends CustomElement {
  constructor() {
    super({ header: false, footer: false, focus: true });
    this.parseSource();
    if (this.title) {
      this.label = document.createElement(`label`);
      this.label.textContent = this.title;
    }
    this.render();
  }

  getStyle() {
    return `
      :host([hidden]) { display: none; }
      :host style { display: none; }
      :host canvas { display: block; margin: auto; }
      :host label { display: block; font-style:italic; font-size: 0.9em; text-align: right;}
    `;
  }

  async parseSource() {
    let codeElement = this.querySelector(`program-code`);
    let code = ``;

    if (codeElement) {
      let src = codeElement.getAttribute('src');
      code = await fetch(src).then(response => response.text());
    } else {
      code = (codeElement ? codeElement : this).textContent;
    }

    if (!codeElement) {
      codeElement = document.createElement(`program-code`);
      codeElement.textContent = code;
      this.textContent = ``;
      this.append(codeElement);
    }

    codeElement.setAttribute(`hidden`, `hidden`);

    new MutationObserver((records) => {
      this.rewriteAndInject(codeElement.textContent);
    }).observe(codeElement, {
      characterData: true,
      attributes: false,
      childList: true,
      subtree: true
    });

    this.rewriteAndInject(code, true);
  }

  rewriteAndInject(code, rerender=false) {
    if (this.script) {
      if (this.script.parentNode) {
        this.script.parentNode.removeChild(this.script);
      }
      this.canvas.parentNode.removeChild(this.canvas);
      rerender = true;
    }

    GraphicsAPI.superCallers.forEach((name) => {
      const re = new RegExp(
        `${name}\\(([^)]*)\\)[\\s\\r\\n]*{[\\s\\r\\n]*`,
        `g`
      );
      code = code.replace(re, `${name}($1) { super.${name}($1);\n`);
    });

    GraphicsAPI.eventHandlers.forEach((name) => {
      const re = new RegExp(`${name}\\(\\)[\\s\\r\\n]*{[\\s\\r\\n]*`, `g`);
      code = code.replace(re, `${name}(evt) { super.${name}(evt);\n`);
    });

    GraphicsAPI.methods.forEach((fn) => {
      const re = new RegExp(`[^.]${fn}\\(`, `g`);
      code = code.replace(re, `this.${fn}(`);
    });

    GraphicsAPI.constants.forEach((name) => {
      const re = new RegExp(`(\\b)${name}(\\b)`, `g`);
      code = code.replace(re, `$1this.${name}$2`);
    });

    const mid = `${Math.random()}`.replace(`0.`,``),
        uid = `bg-uid-${Date.now()}-${mid}`;
        
    window[uid] = this;

    this.code = `
      import { GraphicsAPI, Bezier, Point } from "./graphics-api.js";

      class Example extends GraphicsAPI {
        ${code}
      }

      new Example('${uid}');
    `;

    const script = this.script = document.createElement(`script`);
    script.type = "module";
    script.textContent = this.code;

    if (rerender) this.render();
  }

  handleChildChanges(added, removed) {
    // console.log(`child change:`, added, removed);
  }

  handleAttributeChange(name, oldValue) {
    if (name === `title`) {
      this.label.textContent = this.getAttribute(`title`);
    }
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    clearTimeout(this.insertionAttempt);
    this.render();
  }

  printCodeDueToError() {
    console.log(
      this.code
        .split(`\n`)
        .map((l, pos) => `${pos + 1}: ${l}`)
        .join(`\n`)
    );
  }

  render() {
    super.render();

    if (this.script) {
      if (!this.script.__inserted) {
        this.insertionAttempt = setTimeout(
          () => this.printCodeDueToError(),
          1000
        );
        this.script.__inserted = true;
        this._shadow.appendChild(this.script)
      }
    }

    const p = this._slot.parentNode;
    if (this.canvas) p.insertBefore(this.canvas, this._slot);
    if (this.label) p.insertBefore(this.label, this._slot);
  }
}

CustomElement.register(BezierGraphic);

export { BezierGraphic };
