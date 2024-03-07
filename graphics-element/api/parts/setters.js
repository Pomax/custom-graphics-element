/**
 *
 * @param {*} width
 * @param {*} color
 */
function setBorder(width = 1, color = `black`) {
  if (!width) {
    __canvas.style.border = `none`;
  } else {
    __canvas.style.border = `${width}px solid ${color}`;
  }
}

/**
 *
 * @param {*} color
 */
function setColor(color) {
  setFill(color);
  setStroke(color);
}

/**
 *
 * @param {*} enabled
 */
function setCrisp(enabled = true) {
  __canvas.classList.toggle(`crisp`, enabled);
}

/**
 *
 * @param {*} type
 */
function setCursor(type) {
  __current_cursor = type;
  __canvas.style.cursor = __current_cursor;
}

/**
 *
 * @param {*} color
 */
function setFill(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.fillStyle = color;
}

/**
 *
 * @param {*} font
 */
function setFont(font) {
  __ctx.font = font || `${__font.weight} ${__font.size}px ${__font.family}`;
}

/**
 *
 * @param {*} name
 */
function setFontFamily(name) {
  __font.family = name;
  setFont();
}

/**
 *
 * @param {*} px
 */
function setFontSize(px) {
  __font.size = px;
  setFont();
}

/**
 *
 * @param {*} val
 */
function setFontWeight(val) {
  __font.weight = val;
  setFont();
}

/**
 *
 * @param {*} spacing
 * @param {*} color
 */
function setGrid(spacing = 20, color = `lightgrey`) {
  __draw_grid = true;
  __grid_spacing = spacing;
  __grid_color = color;
}

/**
 *
 * @param {*} color
 */
function setHighlightColor(color) {
  __current_highlight_color = color;
}

/**
 *
 * @param  {...any} values
 */
function setLineDash(...values) {
  __ctx.setLineDash(values);
}

/**
 *
 * @param {*} width
 */
function setLineWidth(width = 1) {
  __ctx.lineWidth = width;
}

/**
 *
 * @param {*} color
 */
function setStroke(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.strokeStyle = color;
}

/**
 *
 * @param {*} xAlign
 * @param {*} yAlign
 */
function setTextAlign(xAlign, yAlign = ALPHABETIC) {
  __ctx.textAlign = xAlign;
  __ctx.textBaseLine = yAlign;
}

/**
 *
 * @param {*} dir
 */
function setTextDirection(dir = `inherit`) {
  __ctx.direction = dir;
}

/**
 *
 * @param {*} color
 * @param {*} width
 */
function setTextStroke(color, width) {
  __textStroke = color;
  setLineWidth(width);
}
