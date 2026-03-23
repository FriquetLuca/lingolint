import type { FileData } from '../hooks/useAudit';

export function rebuildJSON(file: FileData) {
  const result: any = {};

  Object.keys(file.flatData).forEach((path) => {
    const parts = path.split('.');

    parts.reduce((acc, part, index) => {
      const currentPath = parts.slice(0, index + 1).join('.');

      // If we are at the leaf node (the actual translation string)
      if (index === parts.length - 1) {
        acc[part] = file.flatData[path];
      } else {
        if (!acc[part]) {
          // Consult the Schema Map to see if this path should be an Array or Object
          const OriginalType = file.schema.get(currentPath);
          acc[part] = OriginalType === Array ? [] : {};
        }
      }
      return acc[part];
    }, result);
  });

  return result;
}
