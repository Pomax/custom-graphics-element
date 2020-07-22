import { CustomElement } from "./custom-element.js";
import { GraphicsAPI } from "./graphics-api.js";

/**
 * Our custom element
 */
class BezierGraphic extends CustomElement {
  constructor() {
    super({ header: false, footer: false, focus: true });
    this.parseSource();
    this.setStyle();
    if (this.title) {
      this.label = document.createElement(`label`);
      this.label.textContent = this.title;
    }
    this.render();
  }

  setStyle() {
    this._style = document.createElement("style");
    this._style.textContent = `
      :host([hidden]) { display: none; }
      :host style { display: none; }
      :host canvas { display: block; }
      :host label { display: block; font-style:italic; font-size: 0.9em; text-align: right;}
    `;
  }

  parseSource() {
    let codeElement = this.querySelector(`code`);
    let code = (codeElement ? codeElement : this).textContent;

    if (!codeElement) {
      codeElement = document.createElement(`code`);
      codeElement.textContent = code;
      this.textContent = ``;
      this.append(codeElement);
    }

    codeElement.setAttribute(`hidden`, `hidden`);

    new MutationObserver((records) => {
      console.log('wahey', records);
      this.rewriteAndInject(codeElement.textContent);
    }).observe(codeElement, {
      characterData: true,
      attributes: false,
      childList: true,
      subtree: true
    });

    this.rewriteAndInject(code);
  }

  rewriteAndInject(code) {
    let rerender = false;

    if (this.script) {
      console.log('removing');
      this.script.parentNode.removeChild(this.script);
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
      const re = new RegExp(`${fn}\\(`, `g`);
      code = code.replace(re, `this.${fn}(`);
    });

    GraphicsAPI.publicProperties.forEach((name) => {
      const re = new RegExp(`(\\b)${name}(\\b)`, `g`);
      code = code.replace(re, `$1this.${name}$2`);
    });

    // TODO: replace with proper UUID
    this.uuid = Date.now() + Math.random();
    window["bezier-exmples"] = window["bezier-exmples"] || {};
    window["bezier-exmples"][this.uuid] = this;

    this.code = `
      (function() {
        class Example extends GraphicsAPI {
          ${code}
        }
        new Example(${this.uuid});
      })();
    `;

    this.script = document.createElement("script");
    this.script.textContent = this.code;

    if (rerender) this.render();
  }

  handleChildChanges(added, removed) {
    console.log(`child change:`, added, removed);
  }

  handleAttributeChange(name, oldvalue) {
    console.log(`attr change:`, name, this.getAttribute(name), oldvalue);
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
        .join("\n")
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
        document.querySelector("head").appendChild(this.script);
      }
    }

    const p = this._slot.parentNode;
    if (this.canvas) p.insertBefore(this.canvas, this._slot);
    if (this.label) p.insertBefore(this.label, this._slot);
  }
}

CustomElement.register(BezierGraphic);

export { BezierGraphic };
