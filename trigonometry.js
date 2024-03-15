let c, p;

/**
 * What does our code do?
 */
function getDescription() {
  return `
  <p>
    A point <b>P</b> at some <darkgreen>angle</darkgreen> on a circle has
    several trigonometric identities. The <red>sine</red> and
    <blue>cosine</blue> are the projection of <b>P</b> onto the y and x
    axes, respectively, and form two sides of
    <lavender>a right angle triangle</lavender>, with a
    <midnightblue>hypotenuse</midnightblue> that is equal to the circle's
    radius. We also see an
    <mistyrose>"enclosing right triangle"</mistyrose> with the circle's
    center as the right angle corner, the point's
    <darkblue>secant</darkblue> (which is just <blue>1/cosine</blue>) as
    x-axis corner, and the point's <brown>cosecant</brown> (which is just
    <red>1/sine</red>) as y-axis corner. Additionally, our point "splits"
    the enclosing right triangle's hypotenuse into two parts: one part, from
    <b>P</b> to the secant corner, has length
    <orange>tangent</orange> (which is just
    <red>sine</red>/<blue>cosine</blue>), and the other part, from
    <b>P</b> to the cosecant corner, has length
    <purple>cotangent</purple> (which is simply the inverse,
    <blue>cosine</blue>/<red>sine</red>).
  </p>
  `;
}
/**
 * The main setup function
 */
function setup() {
  setSize(500, 200);
  addSlider(`radius`, { min: 1, max: 200, step: 1, value: 130 });
  addSlider(`angle`, {
    max: ((1 / 2) * PI - 0.001).toFixed(3),
    step: 0.001,
    value: 0.65,
  });

  // set up the grid properties but don't draw the grid by default
  setGrid(20, `black`);
  noGrid();

  // give the pane a border and force anti-aliassing off
  setBorder(1, `black`);

  // Then set up our "unit circle", and a point on that circle.
  c = new Circle(width / 2, height / 2, radius);
  p = new Circle(width / 2, height / 2 - radius, 4);
}

/**
 * The main draw function
 */
function draw() {
  clear(`#F8F6F2`);

  const a = angle - PI / 2;
  const cx = width / 2;
  const cy = height / 2;
  translate(-200, cy - 10);

  // loosely base the text size on the circle's radius
  setFontSize(map(radius, 1, 200, 6, 12));

  // draw some cross axes:
  setColor(`black`);
  setLineWidth(0.2);
  line(cx, -huge, cx, huge);
  line(-huge, cy, huge, cy);
  setLineWidth(1);

  // Then make sure our unit circle and point are in the right place:
  c.r = radius;
  p.x = cx + radius * cos(a);
  p.y = cy + radius * sin(a);

  // next, compute the "enclosing triangle" coordinates:
  const e1 = radius * sec(a);
  const e2 = radius * csc(a);
  noStroke();
  setFill(`mistyrose`);
  triangle(cx, cy, cx + e1, cy, cx, cy + e2);

  // then, our "sine/cosine" triangle
  setFill(`lavender`);
  triangle(cx, cy, cx, p.y, p.x, cy);

  // next, we draw our point and unit circle
  setFill(`black`);
  setStroke(`black`);
  setTextAlign(CENTER);
  text(`P`, p.x + 10, p.y - 10);
  circle(p.x, p.y, p.r);
  noFill();
  setLineDash(5);
  circle(c.x, c.y, c.r);
  noLineDash();

  // then, the angle that we're using to draw our point
  setColor(`darkgreen`);
  arc(cx, cy, 10, a, 0);
  setTextAlign(LEFT);
  const b = a + 0.5;
  text(`angle`, cx + 15 * cos(b), cy + 2 + 15 * sin(b));

  // Then we draw our projections from P to the x-axis and y-axis:
  setStroke(`grey`);
  setLineDash(3);
  line(cx, cy + radius * sin(a), p.x, p.y);
  line(cx + radius * cos(a), cy, p.x, p.y);
  line(cx, cy, p.x, p.y);
  noLineDash();

  // Then, our sine/cosine hypotenuse
  setColor(`midnightblue`);
  line(p.x, cy, cx, p.y);
  text(`hypotenuse`, 4 + (cx + p.x) / 2, 2 + (cy + p.y) / 2);

  // The cosine
  setColor(`blue`);
  const cosine = new Point(cx + radius * cos(a), cy);
  line(cx, cy, cosine.x, cosine.y);
  point(cosine.x, cosine.y);
  setTextAlign(RIGHT);
  text(`cosine`, cosine.x - 3, cy - 3);

  // And sine
  setColor(`red`);
  const sine = new Point(cx, cy + radius * sin(a));
  line(cx, cy, sine.x, sine.y);
  point(sine.x, sine.y);
  setTextAlign(LEFT);
  text(`sine`, cx + 3, sine.y + 10);

  // And secant
  setColor(`darkblue`);
  const secant = new Point(cx + radius * sec(a), cy);
  line(cx + radius * cos(a), cy, secant.x, secant.y);
  point(secant.x, secant.y);
  setTextAlign(LEFT);
  text(`secant = sine`, secant.x + 3, secant.y - 8);
  line(secant.x + 43, secant.y - 17, secant.x + 62, secant.y - 17);
  text(`1`, secant.x + 49, secant.y - 20);

  // And cosecant
  setColor(`brown`);
  const cosecant = new Point(cx, cy + radius * csc(a));
  line(cx, cy + radius * sin(a), cosecant.x, cosecant.y);
  point(cosecant.x, cosecant.y);
  setTextAlign(LEFT);
  text(`cosecant`, cosecant.x + 3, cosecant.y - 3);

  // And finally, the tangent
  setColor(`orange`);
  const t = tan(a) * radius;
  const tangent = new Point((p.x + secant.x) / 2, (p.y + secant.y) / 2);
  line(p.x, p.y, p.x + t * sin(a), p.y - t * cos(a));

  // With a bit of "fancy math" typesetting...
  setTextAlign(CENTER);
  let ox = 15;
  let oy = -15;
  text(`sine`, ox + tangent.x, oy + tangent.y - 5);
  line(
    ox + tangent.x - 15,
    oy + tangent.y,
    ox + tangent.x + 15,
    oy + tangent.y
  );
  text(`cosine`, ox + tangent.x, oy + tangent.y + 10);
  setTextAlign(LEFT);
  text(`= tangent`, 20 + ox + tangent.x, oy + tangent.y + 3);

  // And cotangent
  setColor(`purple`);
  const ct = ctn(a) * radius;
  const cotangent = new Point((p.x + cosecant.x) / 2, (p.y + cosecant.y) / 2);
  line(p.x, p.y, p.x - ct * sin(a), p.y + ct * cos(a));

  // Also with a bit of "fancy math" typesetting.
  setTextAlign(CENTER);
  ox = 25;
  oy = -15;
  text(`cosine`, ox + cotangent.x, oy + cotangent.y - 5);
  line(
    ox + cotangent.x - 15,
    oy + cotangent.y,
    ox + cotangent.x + 15,
    oy + cotangent.y
  );
  text(`sine`, ox + cotangent.x, oy + cotangent.y + 10);
  setTextAlign(LEFT);
  text(`= cotangent`, 20 + ox + cotangent.x, oy + cotangent.y + 3);
}
