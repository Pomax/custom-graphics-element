export function base64(data, chunkSize = 512) {
  const bytes = new TextEncoder().encode(data);
  let binString = ``;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    binString += String.fromCodePoint(...chunk);
  }
  return btoa(binString);
}

export function decode64(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}

export function getURLbase(path) {
  const regex = /^(.*)\/([^.]+(\.([^\/?#]+))+)(\?[^#]*)?(#.*)?$/;
  const match = path.match(regex);
  if (match !== null) {
    const { [1]: dirname, [2]: file, [4]: ext } = match;
    path = dirname;
  }
  return path;
}

export function isInViewport(e) {
  if (typeof window === `undefined`) return true;
  if (typeof document === `undefined`) return true;

  var b = e.getBoundingClientRect();
  return (
    b.top >= 0 &&
    b.left >= 0 &&
    b.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    b.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
