import React, { useState } from 'react';
import { useAudit } from './hooks/useAudit';
import JSZip from 'jszip';
import { rebuildJSON } from './utils/rebuildJSON';
import { downloadFile } from './utils/downloadFile';
import { SmartCell } from './components/SmartCell';
import EditableHeader from './components/EditableHeader';
import SmartKeyCell from './components/SmartKeyCell';
import DraggingOverlay from './components/DraggingOverlay';
import Header from './components/Header';
import SmartTable from './components/SmartTable';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();

  const {
    files,
    addFiles,
    allKeys,
    updateKey,
    addGlobalKey,
    newKeys,
    renameFile,
    deleteGlobalKey,
    createEmptyFile,
    removeFile,
  } = useAudit();
  const [isDragging, setIsDragging] = useState(false);

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
      zip.file(`${file.name}.json`, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile('lingolint-export.zip', [blob], 'application/zip');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
      <DraggingOverlay
        {...{
          isDragging,
        }}
      />
      <Header
        {...{
          isFileOpen: files.length > 0,
          fileKeys: allKeys,
          handleDragOver,
          handleDragLeave,
          handleDrop,
          addGlobalKey,
          handleExport,
          addFiles,
          createEmptyFile,
        }}
      />
      <SmartTable
        {...{
          columnCount: files.length,
          handleDragOver,
          handleDragLeave,
          handleDrop,
        }}
      >
        <div className="contents">
          <div className="sticky top-0 left-0 z-50 px-4 py-2 bg-slate-800 border-b border-r border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-widest min-h-11 flex items-center">
            {t('app.key_header')}
          </div>
          {files.map((f) => (
            <EditableHeader
              key={f.name}
              name={f.name}
              onRename={(newName) => renameFile(f.name, newName)}
              onRemove={removeFile}
            />
          ))}
        </div>
        {allKeys.map((key) => (
          <div key={key} className="contents group">
            <SmartKeyCell
              translationKey={key}
              isNew={newKeys.includes(key)}
              onDelete={deleteGlobalKey}
            />
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
      </SmartTable>
    </div>
  );
}
