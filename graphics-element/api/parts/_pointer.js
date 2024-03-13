function __checkForCurrentPoint(x, y, type) {
  currentPoint = false;

  if (!__movable_points.length) return;

  const matches = [];
  const matchPadding = type.includes(`mouse`) ? 10 : 30;

  __movable_points.forEach((p, pos) => {
    let x2 = p[0] === undefined ? p.x : p[0];
    let y2 = p[1] === undefined ? p.y : p[1];
    const d = dist(x, y, x2, y2);
    if (d < (p.r ? p.r : 0) + matchPadding) {
      matches.push({ p, d });
    }
  });

  __canvas.style.cursor = `auto`;

  if (matches.length) {
    matches.sort((a, b) => a.d - b.d);
    currentPoint = matches[0].p;
    __canvas.style.cursor = `pointer`;
  }
}

function __toPointerEvent(evt) {
  let pointer = evt;
  // Convert mouse or touch into generic pointer. Which we need
  // to do because Chrome on MacOS has decided to not generate
  // pointer events when there's a mouse. Thanks Google!
  if (evt.type.includes(`touch`)) {
    const { touches, changedTouches } = evt.originalEvent ?? evt;
    pointer = touches[0] ?? changedTouches[0];
  }
  const { clientX, clientY } = pointer;
  const { left, top } = __canvas.getBoundingClientRect();
  return { offsetX: clientX - left, offsetY: clientY - top };
}

function __pointerDown(x, y) {
  if (currentPoint) {
    currentPoint._dx = currentPoint.x - x;
    currentPoint._dy = currentPoint.y - y;
  }
  if (typeof pointerDown !== `undefined`) pointerDown(x, y);
}

[`touchstart`, `mousedown`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type, down: true, mark: { x, y } });
      __checkForCurrentPoint(x, y, type);
      __pointerDown(x, y);
    }
  });
});

function __pointerUp(x, y) {
  if (typeof pointerUp !== `undefined`) pointerUp(x, y);
  if (pointer.mark?.x === x && pointer.mark?.y === y) {
    if (typeof pointerClick !== `undefined`) pointerClick(x, y);
  }
}

[`touchend`, `mouseup`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type, down: false, mark: false });
      __pointerUp(x, y);
    }
  });
});

function __pointerMove(x, y) {
  let pointMoved = false;
  if (pointer.down && currentPoint) {
    if (currentPoint[0]) {
      currentPoint[0] = x + currentPoint._dx;
      currentPoint[1] = y + currentPoint._dy;
    } else {
      currentPoint.x = x + currentPoint._dx;
      currentPoint.y = y + currentPoint._dy;
    }
    pointMoved = true;
  }

  if (typeof pointerMove !== `undefined`) {
    pointerMove(x, y);
    pointer.drag = false;
    if (pointer.down && typeof pointerDrag !== `undefined`) {
      pointer.drag = true;
      pointerDrag(x, y);
    }
  }
  if (pointMoved && !playing) redraw();
}

[`touchmove`, `mousemove`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type });
      if (!pointer.down) __checkForCurrentPoint(x, y, type);
      __pointerMove(x, y);
    }
  });
});

function __pointerActive(active) {
  if (typeof pointerActive !== `undefined`) {
    pointerActive(active);
  }
}

[`touchstart`, `mouseenter`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    pointer.active = true;
    __pointerActive(true);
  });
});

[`touchend`, `mouseleave`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    pointer.active = false;
    __pointerActive(false);
  });
});
