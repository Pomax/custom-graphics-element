// ***********************************************************************************
//
//   This example shows how to draw a simple  Bezier curve, with interactive points,
//   showing the projection of the mouse cursor on the curve, as well as sending the
//   "t" value of that projected point to the page as an text field's value.
//
//   You may have noticed that this isn't actually true JavaScript: it's not, but
//   the graphics-element is going to convert it into fully valid ES module code,
//   and so to make sure the browser lets you click through to it in a view-source
//   tab, and to make sure that the syntax highlighting in code editors is (mostly)
//   correct, we're using the .js extension for our code.
//
// ***********************************************************************************

/*
  First, we declare a few "global" variables so that we don't need to use
  code that has "this...." everywhere. There's nothing wrong with using
  the "this." namespace, of course, but code sure is easier to read if not
  every line starts with it!
*/

let bezierCurve,
    resetButton,
    currentTValue,
    cursor,
    currentPoint,
    cursorProjection,
    cursorNearPoint,
    backgroundColor;

/**
 * Then, the main entry point for our graphics: this function gets run
 * automatically once our <graphics-element> starts up.
 */
setup() {
  setBorder(1);
  showFocus();
  this.setupPageInteraction();
  this.reset();
  cursor = this.cursor;
}

/**
 * This is a function that helps keep setup() looking nice and tidy:
 * it is responsible for hooking into the additional HTML elements
 * that we added (the text field and button).
 */
setupPageInteraction() {
  // this is the text field
  currentTValue = find(`input[type=text]`);

  // and this is the reset button.
  resetButton = find(`#reset`);

  // Note that anything that we get using find() and findAll() will have some
  // functions that you won't "normally" find on HTML elements, such as this
  // listen() function, which makes event binding a lot less code to write:
  resetButton.listen([`touchstart`, `mousedown`, `keydown`], () => this.onButtonEngaged());
  resetButton.listen([`touchend`, `mouseup`, `keyup`], () => this.onButtonDisengaged());
}

/**
 * Putting all the "setup" code that describes the initial state of your
 * graphic means that it can easily be called by any other code, without
 * having to rerun the setup() function, which we never do.
 */
reset() {
  // Just like in the first example, we define a curve
  bezierCurve = new Bezier(
    this,
    50,50, 150,150, 250,150, 350,50
  );
  // But we also make sure that some of the global variables has "safe" values.
  currentPoint = cursorProjection = cursorNearPoint = false;
  backgroundColor = `#ccffc8`;
}

/**
 * This is another big one: this function automatically gets called after
 * setup() completes, and is the function responsible for updating our canvas.
 */
draw() {
  // First, we clear the canvas and set a background color.
  clear(backgroundColor);

  // Then, we draw a simple grid
  setStroke(`#ccc`);
  this.drawGrid();

  // Then, our  the Bezier curve.
  this.drawCurve();

  // Then, we draw a projection of the cursor's position on the canvas,
  // onto the Bezier curve.
  this.drawProjection();

  // And just because we can, we write the word "test" in the upper left.
  setFill(`grey`);
  text('test', 10, 20);
}

/**
 * In order not to make draw() one giant function, we've put
 * all the code for drawing a Bezier curve in a separate function.
 */
drawCurve() {
  setFill(`grey`);
  bezierCurve.drawSkeleton();
  bezierCurve.drawCurve();
  bezierCurve.drawPoints();
  bezierCurve.drawNormals();
}

/**
 * In order not to make draw() one giant function, we've put
 * all the code for projecting the cursor onto the Bezier curve
 * in a separate function.
 */
drawProjection() {
  // Firstly, we only want to project the cursor if it's not actually
  // "over" (but really, near to) one of the Bezier control points.
  if (cursorProjection && !cursorNearPoint) {
    // We'll draw both the cursor and its project as circles, connected by a straight line:
    setStroke(`#00000044`);
    line(cursor, cursorProjection);
    setStroke(`magenta`);
    setFill(`cyan`);
    circle(cursor, 5);
    circle(cursorProjection, 5);

    // And then we update the text field on the page with the
    // "t" value that is associated with our projection.
    if (cursorProjection.t !== undefined) {
      currentTValue.value = (cursorProjection.t).toFixed(3);
    }
  }
}

/**
 * This is an event handler for when someone pressed the "reset" button,
 * which we've set to trigger up in setupHTMLinteraction(), above.
 */
onButtonEngaged() {
  this.reset();
  backgroundColor = `#afe`;

  // Note this "redraw()" call: the graphics API has no idea when things
  // have changed in a way that requires redrawing everything, so whenever
  // we do something that warrants a drawing up, we have to call this.
  redraw();
}

/**
 * And this is the event handler for when they release the "reset" button,
 * which we've set to trigger up in setupHTMLinteraction(), above.
 */
onButtonDisengaged() {
  backgroundColor = `#efa`;
  redraw();
}

/**
 * What should happen when someone clicks their mouse button?
 */
onMouseDown() {
  // First, we set the color we want for the background to something that
  // lets us know it's the one for "mouse down".
  backgroundColor = `aquamarine`;

  // Then, we check to see whether our cursor is over (or, near) a curve point.
  const p = bezierCurve.getPointNear(cursor, 5);
  if (p) currentPoint = p;

  // And because we changed our color, we need to make sure to redraw.
  redraw();
}

/**
 * What should happen when someone moves their mouse around over the canvas?
 */
onMouseMove() {
  // First, we check if they're actually click-dragging: we checked for the
  // mouse down even above, so if that's true *and* the mouse is moving, they
  // must be click-dragging.
  if (cursor.down && currentPoint) {
    // If the are, *and* they were on (or near) a curve point before, then
    // they're dragging that point along with the cursor!
    currentPoint.x = cursor.x;
    currentPoint.y = cursor.y;

    // Because Bezier curves are defined by their points, we need to make sure
    // to have the curve update itself after we change one of its points.
    bezierCurve.update();
  }

  // Then, if the mouse if moving, we also want to make sure that people are
  // seeing a sensible cursor: a normal pointer most of the time, but a little
  // dragging hand if the cursor is close enough to a curve point that someone
  // would reasonably expect to be able to click-drag it around.
  if (bezierCurve.getPointNear(cursor)) {
    setCursor(HAND);
    cursorNearPoint = true;
  } else {
    setCursor(POINTER);
    cursorNearPoint = false;
  }

  // And finally, get the curve to calculate the project of the mouse cursor
  // onto the curve, so we can draw that as part of our draw() code.
  cursorProjection = bezierCurve.getProjectionPoint(cursor);
  redraw();
}

/**
 * What should happen when someone lets go of their mouse button?
 */
onMouseUp() {
  // For one, we set a super nice new background color!
  backgroundColor = `peachpuff`;

  // But also, we make sure to tell our code that there is no longer
  // anything that someone might be trying to click-drag around.
  currentPoint = undefined;

  // And then, of course, we redraw our scene.
  redraw();
}
