/**
 * Add a slider to your figure, allowing users to control
 * a variable in your graphics code directly by interacting
 * with that on-page slider, which is especially important if
 * you want your graphics to be useable by users who don't
 * have, or cannot use, a mouse.
 *
 * The `propLabel` value should be the name of the variable
 * that your graphics code uses, and should _not_ be "preallocated"
 * in your code with a const, let, or var: it will automatically
 * get added as part of the source loading process.
 *
 * The options object accepts the following properties and values:
 *
 * - min:number - the slider's minimum value, defaults to 0
 * - max:number - the slider's maximum value, defaults to 1
 * - step - the step size, defaults to (max - min)/10
 * - value - the initial value, defaults to (max + min)/2
 * - classes - the CSS classes that will be used, defaults to `sider`
 * - transform - a value preprocessor  defaults to (v) => v
 *
 * The `transform` pre-processor runs after the user updates
 * the slider, but before its value gets assigned to your variable,
 * so that you can map it to something else (for instance, numbers
 * in one range to numbers in a completely different range, or even
 * numbers to strings or entire objects)
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(400, 200);
 *       addSlider(`bgColor`, {
 *         min: 0,
 *         max: 255,
 *         step: 1,
 *         value: 200,
 *         transform: (v) => {
 *           // convert v into a hex color code
 *           v = (v).toString(16).padStart(2, `0`);
 *           return `#${v}${v}${v}`;
 *         }
 *       });
 *     }
 *     function draw() {
 *       clear(bgColor);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} propLabel
 * @param {*} options
 * @returns returns the HTML input element for this slider
 */
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
  value = value === undefined ? (max + min) / 2 : value;

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

/**
 * Remove all sliders for your figure from the page.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       addSlider(`x`);
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       text(`click to clear`, width/2, height/2);
 *     }
 *     function pointerDown() {
 *       clearSliders();
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function clearSliders() {
  const table = __element.querySelector(`table.slider-wrapper`);
  if (table) table.innerHTML = ``;
}

/**
 * Add a button below your figure that can trigger event-based
 * code, which is especially important if you want your graphics
 * to be useable by users who don't have, or cannot use, a mouse.
 *
 * onClick is similar to the standard JS event handler, except
 * that the call argument is a reference to your button, not
 * the click event.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     const colors = [`white`, `black`];
 *     let bgColor = 0;
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`flip background`, () => {
 *         bgColor = -(bgColor - 1);
 *         redraw();
 *       });
 *     }
 *     function draw() {
 *       clear(colors[bgColor]);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {*} label
 * @param {*} onClick
 * @returns
 */
function addButton(label, onClick) {
  if (!onClick) throw new Error(`a button must have an onClick handler`);
  const btn = document.createElement(`button`);
  btn.classList.add(`graphics-element-button`);
  btn.textContent = label;
  btn.addEventListener(`click`, () => onClick(btn));
  __element.prepend(btn);
  return btn;
}

/**
 * Remove all buttons for your figure from the page.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       addButton(`this does nothing`, () => {});
 *     }
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setFontSize(25);
 *       setTextAlign(CENTER, MIDDLE);
 *       text(`click to clear`, width/2, height/2);
 *     }
 *     function pointerDown() {
 *       clearButtons();
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function clearButtons() {
  __element
    .querySelectorAll(`button.graphics-element-button`)
    .forEach((e) => e.remove());
}
