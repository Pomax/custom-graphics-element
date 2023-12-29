// circle and point;
let c, p;

/**
 * ...
 */
function setup() {
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
  setCrisp(true);

  // Then set up our "unit circle", and a point on that circle.
  c = new Circle(width / 2, height / 2, radius);
  p = new Circle(width / 2, height / 2 - radius, 4);
}

/**
 * ...
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

  setFill(`black`);
  setStroke(`black`);
  setTextAlign(CENTER);
  text(`P`, p.x + 10, p.y - 10);
  circle(p.x, p.y, p.r);
  noFill();
  setLineDash(5);
  circle(c.x, c.y, c.r);

  setColor(`darkgreen`);
  noLineDash();
  arc(cx, cy, 10, a, 0);
  setTextAlign(LEFT);
  const b = a + 0.5;
  text(`angle`, cx + 15 * cos(b), cy + 2 + 15 * sin(b));

  noLineDash();
  setStroke(`grey`);
  setLineDash(3);
  line(cx, cy + radius * sin(a), p.x, p.y);
  line(cx + radius * cos(a), cy, p.x, p.y);
  line(cx, cy, p.x, p.y);
  noLineDash();

  setColor(`midnightblue`);
  line(p.x, cy, cx, p.y);
  text(`hypotenuse`, 4 + (cx + p.x) / 2, 2 + (cy + p.y) / 2);

  setColor(`blue`);
  const cosine = new Point(cx + radius * cos(a), cy);
  line(cx, cy, cosine.x, cosine.y);
  point(cosine.x, cosine.y);
  setTextAlign(RIGHT);
  text(`cosine`, cosine.x - 3, cy - 3);

  setColor(`red`);
  const sine = new Point(cx, cy + radius * sin(a));
  line(cx, cy, sine.x, sine.y);
  point(sine.x, sine.y);
  setTextAlign(LEFT);
  text(`sine`, cx + 3, sine.y + 10);

  setColor(`darkblue`);
  const secant = new Point(cx + radius * sec(a), cy);
  line(cx + radius * cos(a), cy, secant.x, secant.y);
  point(secant.x, secant.y);
  setTextAlign(LEFT);
  text(`secant = sine`, secant.x + 3, secant.y - 8);
  line(secant.x + 43, secant.y - 17, secant.x + 62, secant.y - 17);
  text(`1`, secant.x + 49, secant.y - 20);

  setColor(`brown`);
  const cosecant = new Point(cx, cy + radius * csc(a));
  line(cx, cy + radius * sin(a), cosecant.x, cosecant.y);
  point(cosecant.x, cosecant.y);
  setTextAlign(LEFT);
  text(`cosecant`, cosecant.x + 3, cosecant.y - 3);

  setColor(`orange`);
  const t = tan(a) * radius;
  const tangent = new Point((p.x + secant.x) / 2, (p.y + secant.y) / 2);
  line(p.x, p.y, p.x + t * sin(a), p.y - t * cos(a));

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

  setColor(`purple`);
  const ct = ctn(a) * radius;
  const cotangent = new Point((p.x + cosecant.x) / 2, (p.y + cosecant.y) / 2);
  line(p.x, p.y, p.x - ct * sin(a), p.y + ct * cos(a));

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
