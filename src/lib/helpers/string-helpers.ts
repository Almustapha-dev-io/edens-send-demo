export function camelToFlat(str: string) {
  const camelCase = str.replace(/([a-z])([A-Z])/g, '$1 $2');

  return camelCase.toLowerCase();
}

function capitalizeString(s: string) {
  return `${s.charAt(0).toUpperCase()}${s.substring(1).toLowerCase()}`;
}

export function capitalize(s: string, firstLetter = false) {
  if (firstLetter) return capitalizeString(s);

  return s
    .split(' ')
    .map((chunk) => capitalizeString(chunk))
    .join(' ');
}
