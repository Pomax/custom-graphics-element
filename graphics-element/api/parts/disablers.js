/**
 * Ensure that there is no border around the canvas element
 */
function noBorder() {
  setBorder(false);
}

/**
 * Disable both stroke and fill color.
 */
function noColor() {
  noFill();
  noStroke();
}

/**
 * Hide the cursor.
 */
function noCursor() {
  __canvas.style.cursor = `none`;
}

/**
 * Disable the fill color.
 */
function noFill() {
  setFill(`transparent`);
}

/**
 * Disable the default grid background.
 */
function noGrid() {
  __draw_grid = false;
}

/**
 * Set the line stroke to "solid".
 */
function noLineDash() {
  __ctx.setLineDash([]);
}

/**
 * Disable the box shadow.
 */
function noShadow() {
  setShadow(`transparent`, 0);
}

/**
 * Disable the stroke color.
 */
function noStroke() {
  setStroke(`transparent`);
}

/**
 * Disable text stroking.
 */
function noTextStroke() {
  setTextStroke(false, undefined);
}
