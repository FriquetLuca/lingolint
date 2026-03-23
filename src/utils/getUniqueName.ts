import type { FileData } from '../hooks/useAudit';

export const getUniqueName = (name: string, existingFiles: FileData[]) => {
  // Strip .json (case insensitive)
  let baseName = name.replace(/\.json$/i, '');
  let finalName = baseName;
  let counter = 1;

  // If name exists, append (1), (2), etc.
  while (existingFiles.some((f) => f.name === finalName)) {
    finalName = `${baseName} (${counter})`;
    counter++;
  }

  return finalName;
};
