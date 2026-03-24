import { useState, useMemo } from 'react';
import { getUniqueName } from '../utils/getUniqueName';
import type { HistoryStep } from './useHistory';

export type SchemaType = typeof Array | typeof Object;

export interface FileData {
  name: string;
  flatData: Record<string, string>;
  schema: Map<string, SchemaType>;
}

interface useAuditProps {
  pushStep: (step: HistoryStep) => void;
}

export const useAudit = ({ pushStep }: useAuditProps) => {
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
        try {
          const json = JSON.parse(await f.text());
          const { res, schema } = flatten(json);
          const uniqueName = getUniqueName(f.name, currentNames);
          currentNames.push(uniqueName);

          return {
            name: uniqueName,
            flatData: res,
            schema,
          };
        } catch (err) {
          console.error(`Failed to parse ${f.name}`, err);
          return null;
        }
      })
    );
    const validFiles = parsed.filter((f): f is FileData => f !== null);
    if (validFiles.length === 0) return;

    const addedNames = validFiles.map((f) => f.name);
    pushStep({
      label: `Add ${validFiles.length} file(s)`,
      redo: () => {
        setFiles((prev) => [...prev, ...validFiles]);
      },
      undo: () => {
        setFiles((prev) => prev.filter((f) => !addedNames.includes(f.name)));
      },
    });
  };

  const updateKey = (fileName: string, key: string, value: string) => {
    const oldFile = files.find((f) => f.name === fileName);
    const oldValue = oldFile?.flatData[key] || '';
    if (value === oldValue) {
      return;
    }
    pushStep({
      label: `Update ${key} in ${fileName}`,
      redo: () => {
        setFiles((prev) =>
          prev.map((file) =>
            file.name === fileName
              ? { ...file, flatData: { ...file.flatData, [key]: value } }
              : file
          )
        );
      },
      undo: () => {
        setFiles((prev) =>
          prev.map((file) =>
            file.name === fileName
              ? { ...file, flatData: { ...file.flatData, [key]: oldValue } }
              : file
          )
        );
      },
    });
  };

  const addGlobalKey = (path: string) => {
    const isConflict = allKeys.some(
      (k) => path.startsWith(k + '.') || k.startsWith(path + '.')
    );

    if (isConflict) return;

    pushStep({
      label: `Add key ${path}`,
      redo: () => {
        setNewKeys((prev) => [path, ...prev]);
        setFiles((prev) =>
          prev.map((file) => {
            const newSchema = new Map(file.schema);
            path.split('.').forEach((_, i, arr) => {
              if (i < arr.length - 1) {
                const p = arr.slice(0, i + 1).join('.');
                if (!newSchema.has(p)) newSchema.set(p, Object);
              }
            });
            return {
              ...file,
              flatData: { ...file.flatData, [path]: '' },
              schema: newSchema,
            };
          })
        );
      },
      undo: () => {
        setNewKeys((prev) => prev.filter((k) => k !== path));
        setFiles((prev) =>
          prev.map((file) => {
            const nextData = { ...file.flatData };
            delete nextData[path];
            return { ...file, flatData: nextData };
          })
        );
      },
    });
  };

  const renameFile = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;

    const nameExists = files.some((f) => f.name === newName);
    const finalName = nameExists
      ? getUniqueName(
          `${newName}.json`,
          files.map((p) => p.name)
        )
      : newName;

    pushStep({
      label: `Rename ${oldName} to ${finalName}`,
      redo: () =>
        setFiles((prev) =>
          prev.map((f) => (f.name === oldName ? { ...f, name: finalName } : f))
        ),
      undo: () =>
        setFiles((prev) =>
          prev.map((f) => (f.name === finalName ? { ...f, name: oldName } : f))
        ),
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
    const deletedValues = files.map((f) => ({
      fileName: f.name,
      value: f.flatData[keyToDelete],
      schema: f.schema.get(keyToDelete),
    }));
    const wasNewKey = newKeys.includes(keyToDelete);

    pushStep({
      label: `Delete key ${keyToDelete}`,
      redo: () => {
        setFiles((prev) =>
          prev.map((file) => {
            const nextData = { ...file.flatData };
            delete nextData[keyToDelete];
            return { ...file, flatData: nextData };
          })
        );
        setNewKeys((prev) => prev.filter((k) => k !== keyToDelete));
      },
      undo: () => {
        if (wasNewKey) setNewKeys((prev) => [keyToDelete, ...prev]);
        setFiles((prev) =>
          prev.map((file) => {
            const record = deletedValues.find((v) => v.fileName === file.name);
            return record
              ? {
                  ...file,
                  flatData: { ...file.flatData, [keyToDelete]: record.value },
                }
              : file;
          })
        );
      },
    });
  };

  const createEmptyFile = () => {
    const newName = getUniqueName(
      'new translation.json',
      files.map((p) => p.name)
    );

    const newFile: FileData = {
      name: newName,
      flatData: {},
      schema: new Map(),
    };

    allKeys.forEach((key) => {
      newFile.flatData[key] = '';
    });

    pushStep({
      label: `Create empty file: ${newName}`,
      redo: () => {
        setFiles((prev) => [...prev, newFile]);
      },
      undo: () => {
        setFiles((prev) => prev.filter((f) => f.name !== newName));
      },
    });
  };

  const removeFile = (fileName: string) => {
    const fileToRemove = files.find((f) => f.name === fileName);
    if (!fileToRemove) return;
    const originalIndex = files.findIndex((f) => f.name === fileName);

    pushStep({
      label: `Remove file ${fileName}`,
      redo: () => setFiles((prev) => prev.filter((f) => f.name !== fileName)),
      undo: () =>
        setFiles((prev) => {
          const next = [...prev];
          next.splice(originalIndex, 0, fileToRemove);
          return next;
        }),
    });
  };

  const moveFile = (
    draggedName: string,
    targetName: string,
    side: 'left' | 'right'
  ) => {
    const originalOrder = [...files];

    pushStep({
      label: `Move ${draggedName}`,
      redo: () => {
        setFiles((prev) => {
          const next = [...prev];
          const dIdx = next.findIndex((f) => f.name === draggedName);
          const [removed] = next.splice(dIdx, 1);
          const tIdx = next.findIndex((f) => f.name === targetName);
          next.splice(side === 'right' ? tIdx + 1 : tIdx, 0, removed);
          return next;
        });
      },
      undo: () => setFiles(originalOrder),
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
