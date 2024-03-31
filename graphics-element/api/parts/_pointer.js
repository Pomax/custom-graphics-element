function __checkForCurrentMovable(x, y, type) {
  currentMovable = false;

  if (!__movable_points.length) return;

  let foundPoint = false;
  let foundShape = false;
  let matches = [];
  const matchPadding = type.includes(`mouse`) ? 10 : 30;

  __movable_points.forEach((p) => {
    if (p instanceof Shape) {
      if (p.inside(x, y)) {
        foundShape = true;
        matches.push({ p, d: p.__showPoints ? -1 : 0 });
      }
    } else {
      let x2 = p[0] === undefined ? p.x : p[0];
      let y2 = p[1] === undefined ? p.y : p[1];
      const d = dist(x, y, x2, y2);
      if (d < (p.r ? p.r : 0) + matchPadding) {
        foundPoint = true;
        matches.push({ p, d });
      }
    }
  });

  __canvas.style.cursor = `auto`;

  if (foundPoint && foundShape) {
    // if we have a mix of matched points and shapes
    // prioritize activating points instead.
    matches = matches.filter((v) => v.d >= 0);
  }

  const mlen = matches.length;
  if (mlen > 0) {
    if (mlen > 1) matches.sort((a, b) => a.d - b.d);
    currentMovable = matches[0].p;
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

// ==========================

[`touchstart`, `mousedown`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type, down: true, mark: { x, y } });
      __checkForCurrentMovable(x, y, type);
      __pointerDown(x, y);
    }
  });
});

function __pointerDown(x, y) {
  if (currentMovable) {
    if (currentMovable instanceof Shape) {
      // don't do anything special.
    } else {
      currentMovable._dx = currentMovable.x - x;
      currentMovable._dy = currentMovable.y - y;
    }
  }
  if (typeof pointerDown !== `undefined`) pointerDown(x, y);
}

[`touchend`, `mouseup`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, {
        x,
        y,
        type,
        down: false,
        mark: false,
        drag: false,
      });
      __pointerUp(x, y);
    }
  });
});

function __pointerUp(x, y) {
  if (typeof pointerUp !== `undefined`) pointerUp(x, y);
  if (pointer.mark?.x === x && pointer.mark?.y === y) {
    if (typeof pointerClick !== `undefined`) pointerClick(x, y);
  }
  if (currentMovable && currentMovable instanceof Shape) {
    currentMovable.commit();
  }
}

[`touchmove`, `mousemove`].forEach((type) => {
  __canvas.addEventListener(type, (evt) => {
    if (__finished_setup) {
      evt.preventDefault();
      evt.stopPropagation();
      const { offsetX, offsetY } = __toPointerEvent(evt);
      const { x, y } = screenToWorld(offsetX, offsetY);
      Object.assign(pointer, { x, y, type });
      if (!pointer.down) __checkForCurrentMovable(x, y, type);
      __pointerMove(x, y);
    }
  });
});

function __pointerMove(x, y) {
  let hadMovable = false;
  if (pointer.down && currentMovable) {
    if (currentMovable instanceof Shape) {
      currentMovable.offset(x - pointer.mark.x, y - pointer.mark.y);
    } else if (currentMovable[0]) {
      currentMovable[0] = x + currentMovable._dx;
      currentMovable[1] = y + currentMovable._dy;
    } else {
      currentMovable.x = x + currentMovable._dx;
      currentMovable.y = y + currentMovable._dy;
    }
    currentMovable.__on_move?.();
    hadMovable = true;
  }

  pointer.drag = pointer.down;

  if (pointer.drag && typeof pointerDrag !== `undefined`) {
    pointerDrag(x, y);
  }

  if (typeof pointerMove !== `undefined`) {
    pointerMove(x, y);
  }

  if (hadMovable && !playing) redraw();
}

[`touchstart`, `mouseenter`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    pointer.active = true;
    __pointerActive(true);
  });
});

[`touchend`, `mouseleave`].forEach((type) => {
  __canvas.addEventListener(type, () => {
    __pointerActive(false);
  });
});

function __pointerActive(active) {
  if (typeof pointerActive !== `undefined`) {
    pointerActive(active);
  }
}
