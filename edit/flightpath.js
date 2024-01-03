let playButton;
let airplane;
let current = -1;
const points = [];
const trail = [];

/**
 * What does this code do? What are we showing?
 */
function getDescription() {
  return `
  <p>
    This is an illustration of how we can program a
    <black>little airplane</black> to get onto, and then follow, a flight path in
    a way that it doesn't just fly straight along a leg of the journey, but also
    minimizes the time it has to (necessarily) deviate from the flight path when
    it has to switch from one leg to the next.
  </p>
  <p>
    The outer circle controls how our plane gets to the
    <lightgrey>flightpath</lightgrey>, as well as at what point we should switch
    from one leg to the next. To see when we're going to transition from one leg
    to the leg, we <red>project our plane</red>
    onto the next leg of the journey, if there is a next leg. Once our outer
    circle touches reaches that projection, we switch to the next leg.
  </p>
  <p>
    The "innerTarget" parameter controls what point <em>on</em> the flight path
    our airplane actually <magenta>tries to fly towards</magenta>. This is a ratio
    value with 0 representing our airplane, and 1 representing a point on the
    outer circle. Anything in between will lead to our plane trying to stick to
    the flight path "tighter", but in doing so it might not be able to turn fast
    enough to update its <blue>heading</blue> in time, and so we might overshoot
    the flight path instead of undershooting it.
  </p>
  <p>
    And of course You can change this value while the graphic is playing, to see
    the result.
  </p>
  `;
}

/**
 * Our program entry point.
 */
function setup() {
  setSize(650, 500);
  playButton = addButton(`play`, (button) => {
    button.textContent = togglePlay() ? `pause` : `play`;
  });
  addButton(`reset`, () => {
    points.splice(0, points.length);
    trail.splice(0, trail.length);
    reset();
  });
  addSlider(`innerTarget`, { min: 1 / 6, max: 1, step: 1 / 6, value: 4 / 6 });
  noGrid();

  // Set up an "airplane" and a few points that define its flight path:
  airplane = new Airplane(100, 100, 40);
  addPoint(100, 200);
  addPoint(476, 100);
  addPoint(482, 425);
  addPoint(319, 264);
  addPoint(146, 393);
  current = 0;
}

/**
 * The draw loop entry point.
 */
function draw() {
  clear(`#FFEFB0`);

  noFill();

  // Draw the flight path
  setStroke(`lightgrey`);
  plotData(points, `x`, `y`);

  // And the "where we've been so far" trail
  setStroke(`dodgerblue`);
  plotData(trail, `x`, `y`);

  // And then draw each of the path points on top.
  setStroke(`slate`);
  points.forEach((p) => point(p.x, p.y));

  // Then: figure out which heading to fly our plane:
  const target = getTarget(airplane);
  if (target) {
    // Show the target we want to head towards
    setColor(`magenta`);
    line(airplane.x, airplane.y, target.x, target.y);
    circle(target.x, target.y, 3);
    setStroke(`black`);
    if (playing) airplane.update(target);
  } else {
    pause();
    playButton.textContent = `play`;
  }

  // Update our "where we've been" array...
  trail.push(new Point(airplane.x, airplane.y));

  // And then finally, draw the airplane in its current location
  noFill();
  setStroke(`black`);
  airplane.draw();
}

/**
 * The meat and potatoes, where we can experiment with targeting algorithms.
 * At its most basic, though (for demo purposes) we just target "the next point".
 */
function getTarget(airplane) {
  if (current < 0) return;

  let target, p1, p2, p3, i23;

  p1 = points[current];
  if (!p1) return;

  // Are we flying "a leg"?
  p2 = points[current + 1];
  if (!p2) return;
  // If so, target the leg's flightpath
  target = airplane.project(p1.x, p1.y, p2.x, p2.y, innerTarget * airplane.r);

  // But let's also check whether we're close enough to the
  // next leg, if there is one, that we need to transition.
  p3 = points[current + 2];
  if (p3) {
    i23 = airplane.project(p2.x, p2.y, p3.x, p3.y);
    if (i23) {
      // show this point
      setColor(`red`);
      point(i23.x, i23.y);
      setLineDash(4);
      line(airplane.x, airplane.y, i23.x, i23.y);
      noLineDash();
      if (dist(airplane.x, airplane.y, i23.x, i23.y) < airplane.r) {
        // swapsies~
        current++;
        target = i23;
      }
    }
  }

  // There is no "next leg", so we simply transition
  // once we reach the end of the current one.
  else if (dist(airplane.x, airplane.y, p2.x, p2.y) < airplane.r) {
    current++;
  }

  return target;
}

/**
 * If we click on the graphic, place a new point.
 */
function pointerDown(x, y) {
  addPoint(x, y);
  redraw();
}

/**
 * Adding a point also means checking to see if
 * we now "have points at all". If so, we mark
 * the first point as our current target.
 */
function addPoint(x, y) {
  if (currentPoint) return;
  const p = new Point(x, y);
  setMovable(p);
  points.push(p);
}

/**
 * Create a little airplane class that looks barely
 * like an airplane, but *acts* like one by having a
 * speed and turn rate that determine how fast it can
 * change heading when told to.
 */
class Airplane extends Circle {
  speed = 50;
  heading = -0.9;
  bank = 0;
  turnRate = radians(0.5);

  // update the plane's position
  update({ x, y }) {
    if (frameDelta > 50) return;
    const timeInSeconds = frameDelta / 1000;
    const angle = atan2(y - this.y, x - this.x);
    this.setHeading(angle, timeInSeconds);
    const { speed, heading } = this;
    this.x += speed * timeInSeconds * cos(heading);
    this.y += speed * timeInSeconds * sin(heading);
  }

  // update the plane's heading based on a target point
  setHeading(target, timeInSeconds) {
    const { heading, turnRate } = this;
    let diff = (target - heading + TAU) % TAU;
    if (diff > PI) diff -= TAU;
    diff /= timeInSeconds;
    this.heading += constrain(diff, -turnRate, turnRate);
  }

  // draw a little "stick figure" airplane
  draw() {
    const { x, y, r, heading: a, bank, turnRate } = this;
    noFill();
    setStroke(`black`);
    circle(x, y, r);
    // by far the easiest way to draw a little stick figure
    // is to change the coordinate system instead of trying
    // to rotated every individual line, so: save the current
    // drawing context, and then change things:
    save();
    {
      translate(x, y);
      rotate(a);
      setColor(`black`);
      setLineWidth(3);
      line(-10, 0, 10, 0);
      line(-10, -5, -10, 5);
      const wingLength = map(abs(bank), 0, turnRate, 12, 10);
      save();
      {
        rotate(PI / 2);
        line(0, 0, wingLength, 0);
        rotate(PI);
        line(0, 0, wingLength, 0);
      }
      restore();
      setColor(`blue`);
      setLineWidth(1);
      line(0, 0, this.speed, 0);
    }
    // And once we're done, we restore the grahpics context
    // to what it was before we started drawing:
    restore();
  }

  // Determine where on the line p1--p2 this airplane should
  // be projected, based on the shorted projection distance.
  project(x1, y1, x2, y2, r = this.r) {
    const { x, y } = this;
    const dx = x2 - x1;
    const dy = y2 - y1;

    const A = dy ** 2 + dx ** 2;
    const B = 2 * (-x * dx - y * dy + x1 * dx + y1 * dy);
    const C =
      x ** 2 + y ** 2 + x1 ** 2 + y1 ** 2 - 2 * x * x1 - 2 * y * y1 - r ** 2;
    const D = B * B - 4 * A * C;

    const t1 = (-B + sqrt(D)) / (2 * A);
    const t2 = (-B - sqrt(D)) / (2 * A);

    if (isNaN(t1) && isNaN(t2)) {
      // If we're too far from p1--p2, compute the
      // direct projection instead:
      const acx = x - x1;
      const acy = y - y1;
      const f = (dx * acx + dy * acy) / (dx ** 2 + dy ** 2);
      const t = constrain(f, 0, 1);
      const p = new Point(x1 + dx * t, y1 + dy * t);
      return p;
    }

    if (isNaN(t1) || t1 < t2) t1 = t2;

    const t = constrain(t1, 0, 1);
    return { x: x1 + dx * t, y: y1 + dy * t };
  }
}
