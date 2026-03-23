export function getUniqueName(name: string, currentNames: string[]) {
  const baseName = name.replace(/\.json$/i, '');
  let finalName = baseName;
  let counter = 1;
  while (currentNames.some((f) => f === finalName)) {
    finalName = `${baseName} (${counter})`;
    counter++;
  }
  return finalName;
}
