import React, { useCallback, useEffect, useState } from 'react';
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
import AddKeyInput from './components/AddKeyInput';
import ConfirmModal from './components/ConfirmModal';
import Modal, { type ModalConfig } from './components/Modal';
import { useHistory } from './hooks/useHistory';
import ResizeHandle from './components/ResizeHandle';

export default function App() {
  const { t } = useTranslation();

  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const { undo, redo, pushStep, canUndo, canRedo } = useHistory();
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

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
    moveFile,
  } = useAudit({ pushStep });

  if (files.length > 0 && columnWidths.length !== files.length + 1) {
    const newWidths = new Array(files.length + 1).fill(300);

    // If we already had some widths, preserve them and only add/remove for new files
    if (columnWidths.length > 0) {
      // This logic keeps existing widths if you just added ONE file
      for (
        let i = 0;
        i < Math.min(columnWidths.length, newWidths.length);
        i++
      ) {
        newWidths[i] = columnWidths[i];
      }
    }

    setColumnWidths(newWidths);
  }

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-polyfiller-column')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/x-polyfiller-column')) {
      return;
    }

    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.types.includes('application/x-polyfiller-column')) {
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === 'application/json' || file.name.endsWith('.json')
      );
      addFiles(droppedFiles);
    }
  };

  const handleExport = useCallback(async () => {
    const zip = new JSZip();

    files.forEach((file) => {
      const nestedJson = rebuildJSON(file);
      const content = JSON.stringify(nestedJson, null, 2);
      zip.file(`${file.name}.json`, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile('lingolint-export.zip', [blob], 'application/zip');
  }, [files]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey; // Support Mac Command key

      if (isCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExport();
      }
      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if (isCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExport, undo, redo]);

  const gridTemplateColumns =
    columnWidths.length > 0
      ? columnWidths
          .map((w, i) => `${i === 0 ? Math.max(w, 300) : Math.max(w, 200)}px`)
          .join(' ')
      : `300px repeat(${files.length}, 600px)`;

  const handleColumnResize = (index: number, newWidth: number) => {
    setColumnWidths((prev) => {
      const next = [...prev];
      next[index] = newWidth;
      return next;
    });
  };
  return (
    <>
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
            redo,
            undo,
            canUndo,
            canRedo,
          }}
        />
        <SmartTable
          {...{
            columnCount: files.length,
            handleDragOver,
            handleDragLeave,
            handleDrop,
            gridTemplateColumns,
          }}
        >
          <div className="contents">
            <div className="sticky top-0 left-0 z-50 px-4 py-2 bg-slate-800 border-b border-r border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-widest min-h-11 flex items-center">
              {files.length > 0 && (
                <AddKeyInput
                  onAdd={addGlobalKey}
                  existingKeys={allKeys}
                  placeholder={t('app.key_placeholder')}
                  buttonTitle={t('app.button_title')}
                  setModalConfig={setModalConfig}
                />
              )}
              <ResizeHandle onResize={(w) => handleColumnResize(0, w)} />
            </div>
            {files.map((f, i) => (
              <EditableHeader
                key={f.name}
                name={f.name}
                onRename={(newName) => renameFile(f.name, newName)}
                onRemove={removeFile}
                onMove={moveFile}
                setModalConfig={setModalConfig}
                columnIndex={i}
                handleColumnResize={handleColumnResize}
              />
            ))}
          </div>
          {allKeys.map((key) => (
            <div key={key} className="contents group">
              <SmartKeyCell
                translationKey={key}
                isNew={newKeys.includes(key)}
                onDelete={deleteGlobalKey}
                setModalConfig={setModalConfig}
                handleColumnResize={handleColumnResize}
              />
              {files.map((file, i) => (
                <SmartCell
                  key={file.name}
                  value={file.flatData[key]}
                  fileName={file.name}
                  translationKey={key}
                  onUpdate={updateKey}
                  filesCount={files.length}
                  columnIndex={i}
                  handleColumnResize={handleColumnResize}
                />
              ))}
            </div>
          ))}
        </SmartTable>
      </div>
      <ConfirmModal
        isOpen={!!modalConfig && modalConfig.type === 'confirm'}
        title={
          modalConfig !== null ? t(modalConfig.title, modalConfig.datas) : ''
        }
        message={
          modalConfig !== null ? t(modalConfig.message, modalConfig.datas) : ''
        }
        onConfirm={modalConfig?.onConfirm}
        onClose={() => setModalConfig(null)}
        confirmText={
          modalConfig !== null
            ? t(modalConfig.confirmText ?? 'modal.confirm', modalConfig.datas)
            : t('modal.confirm')
        }
        cancelText={
          modalConfig !== null
            ? t(modalConfig.cancelText ?? 'modal.cancel', modalConfig.datas)
            : t('modal.cancel')
        }
      />
      <Modal
        isOpen={!!modalConfig && modalConfig.type === 'error'}
        onClose={() => setModalConfig(null)}
        title={
          modalConfig !== null ? t(modalConfig.title, modalConfig.datas) : ''
        }
        type="danger"
      >
        <p>
          {modalConfig !== null
            ? t(modalConfig.message, modalConfig.datas)
            : undefined}
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setModalConfig(null)}
            className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            {modalConfig !== null
              ? t(modalConfig.cancelText ?? 'modal.cancel', modalConfig.datas)
              : t('modal.cancel')}
          </button>
        </div>
      </Modal>
    </>
  );
}
