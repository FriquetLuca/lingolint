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
    const parsed = await Promise.all(
      newFiles.map(async (f) => {
        const json = JSON.parse(await f.text());
        const { res, schema } = flatten(json);
        let fileName = '';
        setFiles((prev) => {
          fileName = getUniqueName(f.name, prev);
          return prev;
        });

        return {
          name: fileName,
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
    setNewKeys((prev) => [path, ...prev]);
    setFiles((prev) =>
      prev.map((file) => {
        const newSchema = new Map(file.schema);
        const parts = path.split('.');
        parts.forEach((_, index) => {
          if (index < parts.length - 1) {
            const parentPath = parts.slice(0, index + 1).join('.');
            if (!newSchema.has(parentPath)) newSchema.set(parentPath, Object);
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
        ? getUniqueName(`${newName}.json`, prev)
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

        // Also remove from schema to keep things clean
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

  return {
    files,
    setFiles,
    addFiles,
    renameFile,
    allKeys,
    updateKey,
    addGlobalKey,
    deleteGlobalKey,
    newKeys,
  };
};
