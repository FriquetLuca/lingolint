import React, { useState } from 'react';
import { Upload, Table as TableIcon, FileJson, Download } from 'lucide-react';
import { useAudit } from './hooks/useAudit';
import JSZip from 'jszip';
import { rebuildJSON } from './utils/rebuildJSON';
import { downloadFile } from './utils/downloadFile';
import { SmartCell } from './components/SmartCell';
import { AddKeyInput } from './components/AddKeyInput';
import { EditableHeader } from './components/EditableHeader';
import { KeyPathCell } from './components/KeyPathCell';
import DraggingOverlay from './components/DraggingOverlay';

export default function App() {
  const {
    files,
    addFiles,
    allKeys,
    updateKey,
    addGlobalKey,
    newKeys,
    renameFile,
  } = useAudit();
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === 'application/json' || file.name.endsWith('.json')
      );
      addFiles(droppedFiles);
    }
  };

  const handleExport = async () => {
    const zip = new JSZip();

    files.forEach((file) => {
      const nestedJson = rebuildJSON(file);
      const content = JSON.stringify(nestedJson, null, 2);
      // Add the .json extension back here
      zip.file(`${file.name}.json`, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile('polyfiller-export.zip', [blob], 'application/zip');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
      <DraggingOverlay isDragging={isDragging} />

      {/* Header: Locked to top, full width, no horizontal scroll impact */}
      <header
        className="shrink-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg">
            <TableIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Lingolint
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              v1.0.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {files.length > 0 && (
            <AddKeyInput onAdd={addGlobalKey} existingKeys={allKeys} />
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg cursor-pointer text-sm">
            <Upload size={16} className="text-blue-400" />
            Add JSON
            <input
              type="file"
              multiple
              accept=".json"
              className="hidden"
              onChange={(e) =>
                e.target.files && addFiles(Array.from(e.target.files))
              }
            />
          </label>
          {files.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              <Download size={16} /> Export
            </button>
          )}
        </div>
      </header>

      {/* Main: This is now the ONLY scrollable area */}
      <main
        className="flex-1 overflow-auto px-6 pb-6 bg-slate-950"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {files.length === 0 ? (
          <div className="mt-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl py-24 bg-slate-900/50">
            <FileJson size={48} className="text-slate-600 mb-6" />
            <h2 className="text-xl font-semibold text-slate-300">
              Drop files to get started
            </h2>
          </div>
        ) : (
          /* Wrapper to ensure background covers the full width of the overflowing grid */
          <div className="inline-block min-w-full align-middle">
            <div
              className="grid border border-slate-800 bg-slate-900 relative"
              style={{
                gridTemplateColumns: `300px repeat(${files.length}, 600px)`,
                overflow: 'visible',
              }}
            >
              {/* Header Row */}
              <div className="contents">
                {/* 1. The Key Path Corner - Must be z-50 to stay above everything */}
                <div className="sticky top-0 left-0 z-50 p-4 bg-slate-800 border-b border-l border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-widest min-h-11 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  Key Path
                </div>

                {/* 2. The File Headers - Sticky top-0, but NOT left-0 */}
                {files.map((f) => (
                  <div
                    key={f.name}
                    // The z-40 ensures these stay UNDER the "Key Path" corner when scrolling horizontally
                    // but ABOVE the data cells when scrolling vertically.
                    className="sticky top-0 z-40 bg-slate-800 border-b border-l border-slate-700 shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
                  >
                    <EditableHeader
                      name={f.name}
                      onRename={(newName) => renameFile(f.name, newName)}
                    />
                  </div>
                ))}
              </div>

              {/* --- DATA ROWS --- */}
              {allKeys.map((key) => (
                <div key={key} className="contents group">
                  {/* 3. THE KEY COLUMN: Sticky Left ONLY */}
                  <div className="sticky left-0 z-30 min-h-full flex items-stretch">
                    <KeyPathCell
                      translationKey={key}
                      isNew={newKeys.includes(key)}
                    />
                  </div>

                  {/* 4. THE CELLS: Normal flow */}
                  {files.map((file) => (
                    <SmartCell
                      key={file.name}
                      value={file.flatData[key]}
                      fileName={file.name}
                      translationKey={key}
                      onUpdate={updateKey}
                      filesCount={files.length}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
