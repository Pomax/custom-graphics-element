function waitFor(check) {
  return new Promise((resolve, reject) => {
    (function test() {
      try {
        if (check()) return resolve();
      } catch (e) {
        return reject(e);
      }
      setTimeout(test, 200);
    })();
  });
}

const demoCode = await fetch(
  document.querySelector(`#demos button`).dataset.src
).then((r) => r.text());
const stored = (function () {
  try {
    return JSON.parse(localStorage.getItem(`code`)) ?? {};
  } catch (e) {}
  return {};
})();
const userCode = stored.userCode || demoCode;
const additionalSources = stored.additionalSources;

await customElements.whenDefined(`graphics-element`);
const graphics = document.querySelector(`graphics-element`);
await waitFor(() => typeof graphics.loadSource === `function`);

await waitFor(() => typeof monaco !== `undefined`);
const editorParent = document.getElementById(`editor`);

const editors = [];
let debounce = -1;

// Hook up the demo buttons
(function setupDemos() {
  const demos = document.querySelectorAll(`#demos button`);
  demos.forEach((button) =>
    button.addEventListener(`click`, ({ target }) => loadDemo(target))
  );
})();

// And then build our editor(s) and fill the graphics element
buildPage(editorParent, userCode, additionalSources);

// -------------

async function loadDemo(button) {
  document.querySelector(`#demos button.active`).classList.remove(`active`);
  button.classList.add(`active`);
  let userCode = await fetch(button.dataset.src).then((r) => r.text());
  let additionalSources = undefined;
  const extra = button.dataset.extraSources;
  if (extra) {
    additionalSources = await Promise.all(
      JSON.parse(extra).map((url) => fetch(url).then((r) => r.text()))
    );
  }
  buildPage(editorParent, userCode, additionalSources);
}

function buildPage(editorParent, userCode, additionalSources) {
  clearEditors();
  editorParent.innerHTML = ``;
  graphics.innerHTML = ``;
  graphics.__running_initial_code_load = true;

  const sourceDiv = document.createElement(`div`);
  sourceDiv.classList.add(`editor`);
  editorParent.append(sourceDiv);

  const sourceEditor = createEditor(sourceDiv);
  sourceEditor.setValue(userCode);

  additionalSources?.forEach((userCode) => {
    const additionalSourceHeading = document.createElement(`h4`);
    additionalSourceHeading.textContent = `Additional source:`;
    editorParent.append(additionalSourceHeading);

    const additionalSourceDiv = document.createElement(`div`);
    additionalSourceDiv.classList.add(`editor`);
    editorParent.append(additionalSourceDiv);
    const additionalSourceEditor = createEditor(additionalSourceDiv);
    additionalSourceEditor.setValue(userCode);
  });

  graphics.reset(userCode, additionalSources);
  delete graphics.__running_initial_code_load;
}

function createEditor(editorParent) {
  const editorOptions = {
    value: userCode,
    language: "javascript",
    automaticLayout: true,
  };

  const editor = monaco.editor.create(editorParent, editorOptions);
  editors.push(editor);

  // let's keep code nice and concise.
  editor.getModel().updateOptions({
    detectIndentation: true,
    insertSpaces: true,
    tabSize: 2,
  });

  // Add update debouncing, so we don't refresh on every keystroke.
  editor.onDidChangeModelContent(({ changes }) => loadUpdates());

  return editor;
}

function clearEditors() {
  editors.forEach((e) => e.dispose());
  editors.splice(0, editors.length);
}

function loadUpdates() {
  if (graphics.__running_initial_code_load) return;
  console.log(`loadUpdates`);
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const src = editors.map((e) => e.getValue());
    const userCode = src[0];
    const additionalSources = src.slice(1);
    localStorage.setItem(
      `code`,
      JSON.stringify({ userCode, additionalSources })
    );
    console.log(`RESETTING`);
    graphics.reset(userCode, additionalSources);
    debounce = -1;
  }, 500);
}
