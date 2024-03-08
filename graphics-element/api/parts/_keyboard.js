function __safelyInterceptKey(evt) {
  // We don't want to interfere with the browser, so we're only
  // going to allow unmodified keys, or shift-modified keys,
  // and tab has to always work. For obvious reasons.
  const tab = evt.key !== "Tab";
  const functionKey = evt.key.match(/F\d+/) === null;
  const specificCheck = tab && functionKey;
  if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && specificCheck) {
    if (evt.target === __canvas) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
}

function __keyDown(key, shiftKey, altKey, ctrlKey, metaKey) {
  keyboard[key] = Date.now();
  if (typeof keyDown !== `undefined`)
    keyDown(key, shiftKey, altKey, ctrlKey, metaKey);
}

__canvas.addEventListener(`keydown`, (evt) => {
  __safelyInterceptKey(evt);
  const { key, shiftKey, altKey, ctrlKey, metaKey } = evt;
  if (__finished_setup) __keyDown(key, shiftKey, altKey, ctrlKey, metaKey);
});

function __keyUp(key, shiftKey, altKey, ctrlKey, metaKey) {
  delete keyboard[key];
  if (typeof keyUp !== `undefined`)
    keyUp(key, shiftKey, altKey, ctrlKey, metaKey);
}

__canvas.addEventListener(`keyup`, (evt) => {
  __safelyInterceptKey(evt);
  const { key, shiftKey, altKey, ctrlKey, metaKey } = evt;
  if (__finished_setup) __keyUp(key, shiftKey, altKey, ctrlKey, metaKey);
});
