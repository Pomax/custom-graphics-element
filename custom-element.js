const REG_KEY = `registered as custom element`;

// helper function
function NotImplemented(instance, fname) {
  console.warn(
    `missing implementation for ${fname}(...data) in ${instance.__proto__.constructor.name}`
  );
}

// helper function for turning "ClassName" into "class-name"
function getElementTagName(cls) {
  return cls.prototype.constructor.name.replace(
    /([A-Z])([a-z])/g,
    (a, b, c, d) => {
      const r = `${b.toLowerCase()}${c}`;
      return d > 0 ? `-${r}` : r;
    }
  );
}

/**
 * This is an enrichment class to make working with custom elements
 * actually pleasant, rather than a ridiculous exercise in figuring
 * out a low-level spec.
 */
class CustomElement extends HTMLElement {
  static register(cls) {
    if (!cls[REG_KEY]) {
      const tagName = cls.tagName;
      customElements.define(tagName, cls);
      cls[REG_KEY] = true;
      return customElements.whenDefined(tagName);
    }
    return Promise.resolve();
  }

  static get tagName() {
    return getElementTagName(this);
  }

  constructor(options = {}) {
    super();

    this._options = options;

    const route = {
      childList: (record) => {
        this.handleChildChanges(Array.from(record.addedNodes), Array.from(record.removedNodes));
        this.render();
      },
      attributes: (record) => {
        this.handleAttributeChange(record.attributeName, record.oldValue);
        this.render();
      },
    };

    // Set up a mutation observer because the normal lifecycle
    // functions are basically useless for DOM operations.
    this._observer = new MutationObserver((records) => {
      if (this.isConnected) {
        records.forEach((record) => {
          // console.log(record);
          route[record.type](record);
        });
      }
    });

    this._observer.observe(this, {
      childList: true,
      attributes: true,
    });

    // Set up a shadow DOM. Note that we're going to be using this
    // *very little* because DOM manipulation should stay possible.
    // Custom Elements should not be siloed magic black boxes.

    const shadowProps = {
      mode: `open`,
      delegatesFocus: !!this._options.focus,
    };

    // Oh, and: don't you dare ever setting mode:closed, ever.
    // Why are you even on the web, go write standalone software
    // and get the hell off our global shared open platform
    // if you want prevent folks from learning how your code works
    // so they can control how much you get to do on their computer.

    this._shadow = this.attachShadow(shadowProps);
    this._header = document.createElement(`header`);
    this._main = document.createElement(`main`);
    this._slot = document.createElement(`slot`);
    this._main.append(this._slot);
    this._footer = document.createElement(`footer`);

    this.render();
  }

  handleChildChanges(added, removed) {
    if (!this._options.void)
      NotImplemented(this, `handleChildChanges`);
  }

  handleAttributeChange(name, oldvalue) {
    if (!this._options.void)
      NotImplemented(this, `handleAttributeChange`);
  }

  render() {
    this._shadow.innerHTML = ``;
    if (this._style) this._shadow.append(this._style);
    if (this._options.header !== false) this._shadow.append(this._header);
    if (this._options.slot !== false) this._shadow.append(this._main);
    if (this._options.footer !== false) this._shadow.append(this._footer);
  }
}

export { CustomElement };
