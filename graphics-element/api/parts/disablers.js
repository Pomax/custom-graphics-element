/**
 * Ensure that there is no border around the canvas element.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function setup() {
 *       setSize(200, 200);
 *       setBorder(5, `red`);
 *     }
 *
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       text(`click me`, width/2, height/2);
 *     }
 *
 *     function pointerUp(x, y) {
 *       setBorder(5, `red`);
 *       redraw()
 *     }
 *
 *     function pointerDown(x, y) {
 *       noBorder();
 *       redraw()
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @see {@link setBorder}
 */
function noBorder() {
  setBorder(false);
}

/**
 * Disable both stroke and fill color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       text(`Now you see me`, width/2, height/2 - 25);
 *       noColor();
 *       text(`Now you don't`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 *
 * @see {@link setColor}
 * @see {@link noStroke}
 * @see {@link noFill}
 */
function noColor() {
  noFill();
  noStroke();
}

/**
 * Hide the cursor.
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
 */
function noCursor() {
  __canvas.style.cursor = `none`;
}

/**
 * Disable the fill color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`filled`, width/2, height/2 - 25);
 *       noFill();
 *       rect(30, 80, 20, 20);
 *       text(`not filled`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function noFill() {
  setFill(`transparent`);
}

/**
 * Disable the default grid background.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       text(`click me`, width/2, height/2);
 *     }
 *
 *     function pointerUp(x, y) {
 *       setGrid(20, `lightgrey`);
 *       redraw()
 *     }
 *
 *     function pointerDown(x, y) {
 *       noGrid();
 *       redraw()
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function noGrid() {
  __draw_grid = false;
}

/**
 * Set the line stroke to "solid".
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setColor(`black`);
 *       setLineDash(1);
 *       line(0,20,width,50);
 *       setLineDash(5);
 *       line(0,30,width,90);
 *       setLineDash(1,2,3,4);
 *       line(0,40,width,130);
 *       noLineDash();
 *       line(0,50,width,180);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function noLineDash() {
  __ctx.setLineDash([]);
}

/**
 * Disable the stroke color.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`red`);
 *       setStroke(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`stroked`, width/2, height/2 - 25);
 *       noStroke();
 *       rect(42, 82, 20, 20);
 *       text(`not stroked`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function noStroke() {
  setStroke(`transparent`);
}

/**
 * Disable text stroking, but not regular shape stroking.
 *
 * Example:
 *
 * <graphics-element>
 *   <graphics-source>
 *     function draw() {
 *       clear(`white`);
 *       setTextAlign(CENTER, MIDDLE);
 *       setFontSize(25);
 *       setTextStroke(1);
 *       setColor(`red`);
 *       setStroke(`black`);
 *       rect(20, 70, 20, 20);
 *       text(`stroked`, width/2, height/2 - 25);
 *       noTextStroke();
 *       rect(42, 82, 20, 20);
 *       text(`not stroked`, width/2, height/2 + 25);
 *     }
 *   </graphics-source>
 * </graphics-element>
 */
function noTextStroke() {
  setTextStroke(false, undefined);
}
