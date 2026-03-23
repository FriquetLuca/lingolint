import type { FileData } from '../hooks/useAudit';

export function getUniqueName(name: string, existingFiles: FileData[]) {
  let baseName = name.replace(/\.json$/i, '');
  let finalName = baseName;
  let counter = 1;
  while (existingFiles.some((f) => f.name === finalName)) {
    finalName = `${baseName} (${counter})`;
    counter++;
  }
  return finalName;
}
