export function base64(data) {
  const bytes = new TextEncoder().encode(data);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

export function decode64(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}
