await customElements.whenDefined(`graphics-element`);

const input = document.querySelector(`textarea`);
const graphics = document.querySelector(`graphics-element`);
const playButton = document.querySelector(`button`);

let runUpdate = -1;
input.addEventListener(`input`, ({ target }) => {
  const { value } = target;
  clearTimeout(runUpdate);
  runUpdate = setTimeout(() => {
    graphics.loadSource(undefined, undefined, value);
    localStorage.setItem(`code`, value);
  }, 500);
});

const code = localStorage.getItem(`code`);
if (code) {
  input.value = code;
  graphics.loadSource(undefined, undefined, code);
}
