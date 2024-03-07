/**
 *
 * @param {*} propLabel
 * @param {*} assign
 * @param {*} options
 * @returns
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

/**
 *
 */
function clearSliders() {
  const table = __element.querySelector(`table.slider-wrapper`);
  if (table) table.innerHTML = ``;
}

/**
 *
 * @param {*} label
 * @param {*} onClick
 * @returns
 */
function addButton(label, onClick) {
  const btn = document.createElement(`button`);
  btn.classList.add(`graphics-element-button`);
  btn.textContent = label;
  btn.addEventListener(`click`, () => onClick(btn));
  __element.prepend(btn);
  return btn;
}

/**
 *
 */
function clearButtons() {
  __element
    .querySelectorAll(`button.graphics-element-button`)
    .forEach((e) => e.remove());
}
