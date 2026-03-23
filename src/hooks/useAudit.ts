import { useState, useMemo } from 'react';
import { getUniqueName } from '../utils/getUniqueName';

export type SchemaType = typeof Array | typeof Object;

export interface FileData {
  name: string;
  flatData: Record<string, string>;
  schema: Map<string, SchemaType>;
}

export const useAudit = () => {
  const [newKeys, setNewKeys] = useState<string[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);

  const flatten = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any,
    prefix = '',
    schema = new Map<string, SchemaType>(),
    res: Record<string, string> = {}
  ) => {
    for (const key in obj) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        schema.set(path, Array.isArray(obj[key]) ? Array : Object);
        flatten(obj[key], path, schema, res);
      } else {
        res[path] = String(obj[key]);
      }
    }
    return { res, schema };
  };

  const addFiles = async (newFiles: File[]) => {
    const currentNames = files.map((f) => f.name);

    const parsed = await Promise.all(
      newFiles.map(async (f) => {
        const json = JSON.parse(await f.text());
        const { res, schema } = flatten(json);
        const uniqueName = getUniqueName(f.name, currentNames);
        currentNames.push(uniqueName);

        return {
          name: uniqueName,
          flatData: res,
          schema,
        };
      })
    );
    setFiles((prev) => [...prev, ...parsed]);
  };

  const updateKey = (fileName: string, key: string, value: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.name === fileName) {
          return {
            ...file,
            flatData: { ...file.flatData, [key]: value },
          };
        }
        return file;
      })
    );
  };

  const addGlobalKey = (path: string) => {
    const isConflict = allKeys.some((existingKey) => {
      if (path.startsWith(existingKey + '.')) {
        alert(
          `Conflict: "${existingKey}" is already a string and cannot have children.`
        );
        return true;
      }
      if (existingKey.startsWith(path + '.')) {
        alert(
          `Conflict: "${path}" is already an object containing "${existingKey}".`
        );
        return true;
      }
      return false;
    });

    if (isConflict) return;

    setNewKeys((prev) => [path, ...prev]);
    setFiles((prev) =>
      prev.map((file) => {
        const newSchema = new Map(file.schema);
        const parts = path.split('.');

        parts.forEach((_, index) => {
          if (index < parts.length - 1) {
            const parentPath = parts.slice(0, index + 1).join('.');
            if (!newSchema.has(parentPath)) {
              newSchema.set(parentPath, Object);
            }
          }
        });

        return {
          ...file,
          flatData: { ...file.flatData, [path]: '' },
          schema: newSchema,
        };
      })
    );
  };

  const renameFile = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;

    setFiles((prev) => {
      const nameExists = prev.some((f) => f.name === newName);
      const finalName = nameExists
        ? getUniqueName(
            `${newName}.json`,
            prev.map((p) => p.name)
          )
        : newName;
      return prev.map((file) =>
        file.name === oldName ? { ...file, name: finalName } : file
      );
    });
  };

  const allKeys = useMemo(() => {
    const existing = new Set<string>();
    files.forEach((f) =>
      Object.keys(f.flatData).forEach((k) => {
        if (!newKeys.includes(k)) existing.add(k);
      })
    );
    return [...newKeys, ...Array.from(existing).sort()];
  }, [files, newKeys]);

  const deleteGlobalKey = (keyToDelete: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        const newData = { ...file.flatData };
        delete newData[keyToDelete];
        const newSchema = new Map(file.schema);
        newSchema.delete(keyToDelete);

        return {
          ...file,
          flatData: newData,
          schema: newSchema,
        };
      })
    );
    setNewKeys((prev) => prev.filter((k) => k !== keyToDelete));
  };

  const createEmptyFile = () => {
    setFiles((prev) => {
      const newName = getUniqueName(
        'new translation.json',
        prev.map((p) => p.name)
      );
      const newFile: FileData = {
        name: newName,
        flatData: {},
        schema: new Map(),
      };
      if (allKeys.length > 0) {
        allKeys.forEach((key) => {
          newFile.flatData[key] = '';
        });
      }

      return [...prev, newFile];
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.name !== fileName);
      return updated;
    });
  };

  const moveFile = (
    draggedName: string,
    targetName: string,
    side: 'left' | 'right'
  ) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const draggedIdx = newFiles.findIndex((f) => f.name === draggedName);
      let targetIdx = newFiles.findIndex((f) => f.name === targetName);

      if (draggedIdx === -1 || targetIdx === -1) return prev;

      const [removed] = newFiles.splice(draggedIdx, 1);
      targetIdx = newFiles.findIndex((f) => f.name === targetName);
      const finalIdx = side === 'right' ? targetIdx + 1 : targetIdx;

      newFiles.splice(finalIdx, 0, removed);
      return newFiles;
    });
  };

  return {
    files,
    setFiles,
    addFiles,
    renameFile,
    allKeys,
    updateKey,
    addGlobalKey,
    deleteGlobalKey,
    createEmptyFile,
    removeFile,
    moveFile,
    newKeys,
  };
};
