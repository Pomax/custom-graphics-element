/**
 * Set a border around the canvas.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setBorder(10, `red`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number|boolean} width? The width of the border in pixels, disabling the border omitted
 * @param {string} color? The CSS color to use for the border (default = black)
 *
 * @see {@link noBorder}
 */
function setBorder(width = 1, color = `black`) {
  if (!width) {
    __canvas.style.border = `none`;
  } else {
    __canvas.style.border = `${width}px solid ${color}`;
  }
}

/**
 * Set the current stroke and fill colour at
 * the same time.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear();
 *       setColor(`blue`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} color The CSS color to use for the border
 *
 * @see {@link setStroke}
 * @see {@link setFill}
 * @see {@link noColor}
 */
function setColor(color) {
  setFill(color);
  setStroke(color);
}

/**
 * Change the cursor to a specific icon:
 *
 * - AUTO - use whatever the browser would otherwise use
 * - CROSS - use a cross-hair icon
 * - POINTER - use the "pointer" icon that is also used for clickable links
 *
 * Use any other string found over on the MDN cursor article to set a cursor not covered by the above constants.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`#FF02`);
 *       rect(0, 0, width/2, height);
 *       setColor(`#0FF2`);
 *       rect(width/2, 0, width/2, height);
 *     }
 *
 *     function pointerMove(x, y) {
 *       if (x < width/2) {
 *         setCursor(AUTO);
 *       } else {
 *         noCursor();
 *       }
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} type The CSS cursor type
 *
 * @see {@link noCursor}
 */
function setCursor(type) {
  __current_cursor = type;
  __canvas.style.cursor = __current_cursor;
}

/**
 * Set the current fill colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear();
 *       setStroke(`black`);
 *       setFill(`red`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} color The CSS color to use for the border (default = black)
 *
 * @see {@link noFill}
 */
function setFill(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.fillStyle = color;
}

/**
 * Set the current font using a single string. For the syntax,
 * see https://developer.mozilla.org/en-US/docs/Web/CSS/font
 *
 * @param {string} font A CSS shorthand font property
 *
 * @see {@link setFontFamily}
 * @see {@link setFontSize}
 * @see {@link setFontWeight}
 */
function setFont(font) {
  __ctx.font = font || `${__font.weight} ${__font.size}px ${__font.family}`;
}

/**
 * Set the current font family.
 *
 * @param {string} name The CSS font family name
 *
 * @see {@link setFontSize}
 * @see {@link setFontWeight}
 */
function setFontFamily(name) {
  __font.family = name;
  setFont();
}

/**
 * Set the current font size
 *
 * @param {number} px The font size in pixels
 *
 * @see {@link setFontFamily}
 * @see {@link setFontWeight}
 */
function setFontSize(px) {
  __font.size = px;
  setFont();
}

/**
 * Set the current font weight
 *
 * @param {number|string} val The CSS weight number or one of the special strings "normal", "bold", "bolder", or "lighter".
 *
 * @see {@link setFontFamily}
 * @see {@link setFontSize}
 */
function setFontWeight(val) {
  __font.weight = val;
  setFont();
}

/**
 * Set the background grid spacing and colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *      function setup() {
 *       setSize(200, 200);
 *       setGrid(20, `lavender`);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} spacing? The spacing between grid lines in pixels (default = 20)
 * @param {string} color? The CSS color to use for the border (default = lightgrey)
 *
 * @see {@link noGrid}
 */
function setGrid(spacing = 20, color = `lightgrey`) {
  __draw_grid = true;
  __grid_spacing = spacing;
  __grid_color = color;
}

/**
 * Set the color that should be used to replace whatever
 * highlight() marked as the "to highlight" color.
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
 * @param {string} color The CSS color to use for the border
 *
 * @see {@link highlight}
 */
function setHighlightColor(color) {
  __current_highlight_color = color;
}

/**
 * Set the line dash property. See the following MDN article for the details:
 *
 * https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash
 *
 * @param  {number[]} ...values The dash intervals in pixel
 *
 * @see {@link noLineDash}
 */
function setLineDash(...values) {
  __ctx.setLineDash(values);
}

/**
 * Set the line width in pixels.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       range(1, 10, (i) => {
 *         setLineWidth(i);
 *         line(20, i * 20, 180, i * 20);
 *       })
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {number} width? The line width in pixels (default = 1)
 *
 * @see {@link setTextStroke}
 */
function setLineWidth(width = 1) {
  __ctx.lineWidth = width;
}

/**
 * Set the current stroke colour.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear();
 *       setStroke(`black`);
 *       setFill(`red`);
 *       rect(50, 50, 100, 100);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} color The CSS color to use for the border (default = black)
 *
 * @see {@link setFill}
 * @see {@link setColor}
 */
function setStroke(color = `black`) {
  if (CSS_COLOR_MAP[color] === __highlight_color) {
    color = __current_highlight_color;
  }
  __ctx.strokeStyle = color;
}

/**
 * Set the current text alignment values.
 *
 * Valid `xAlign` values are:
 *
 * - CENTER - the text anchor is in the middle of the text. Text is placed evenly on either side.
 * - END - the text anchor is on the right for LTR text, and on the left for RTL text.
 * - LEFT - the text anchor is on the left side of the text. all text is to the right.
 * - RIGHT - the text anchor is on the right side of the text. All text is to the left.
 * - START - the text anchor is on the left for LTR text, and on the right for RTL text.
 *
 * Valid `yAlign` values are:
 *
 * - ALPHABETIC - standard text alignment (default)
 * - BOTTOM - the text is aligned to the bottom of the bounding box
 * - HANGING - relevant for Tibetan and other Indic scripts.
 * - IDEOGRAPHIC - relevant for ideographic CJKV text.
 * - MIDDLE - The vertical equivalent of "center".
 * - TOP - The text is aligned to the top of the typographic "em square".
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setFontSize(20);
 *       setColor(`black`);
 *       line(width / 2, 0, width / 2, height);
 *       line(0, height / 2, width, height / 2);
 *       setTextAlign(CENTER, MIDDLE);
 *       text("center middle", width / 2, height/2);
 *       line(0, height / 2 - 50, width, height / 2 - 50);
 *       setTextAlign(RIGHT, TOP);
 *       text("right top", width / 2, height/2 - 50);
 *       line(0, height / 2 + 50, width, height / 2 + 50);
 *       setTextAlign(LEFT, BOTTOM);
 *       text("left bottom", width / 2, height/2 + 50);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} xAlign The CSS horizontal alignment
 * @param {string} yAlign The CSS vertical alignment
 */
function setTextAlign(xAlign, yAlign) {
  __ctx.textAlign = xAlign;
  __ctx.textBaseline = yAlign;
}

/**
 * Set the text outline stroking properties.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setFontSize(25);
 *       setTextStroke(`red`, 1);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 80, CENTER, CENTER);
 *       setFontSize(65);
 *       setTextStroke(`red`, 3);
 *       setFill(`yellow`);
 *       text("fancy text", width/2, 140, CENTER, CENTER);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @param {string} color The CSS color to use for the border
 * @param {number} width? The text stroke width in pixels (default = 1)
 *
 * @see {@link setStroke}
 * @see {@link setLineWidth}
 */
function setTextStroke(color, width = 1) {
  __textStroke = color;
  setLineWidth(width);
}
