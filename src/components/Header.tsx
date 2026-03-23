import { Download, Plus, TableIcon, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  isFileOpen: boolean;
  handleDragOver?: React.DragEventHandler<HTMLElement> | undefined;
  handleDragLeave?: React.DragEventHandler<HTMLElement> | undefined;
  handleDrop?: React.DragEventHandler<HTMLElement> | undefined;
  createEmptyFile: () => void;
  addFiles: (newFiles: File[]) => Promise<void>;
  handleExport: () => Promise<void>;
}

export default function Header({
  isFileOpen,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleExport,
  addFiles,
  createEmptyFile,
}: HeaderProps) {
  const { t } = useTranslation();
  return (
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
        <h1 className="text-lg font-bold text-white leading-none">Lingolint</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={createEmptyFile}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all text-sm font-medium text-slate-200"
        >
          <Plus size={16} className="text-emerald-400" />
          {t('header.new_json')}
        </button>
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg cursor-pointer text-sm">
          <Upload size={16} className="text-blue-400" />
          {t('header.add_json')}
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
        {isFileOpen && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            <Download size={16} /> {t('header.export')}
          </button>
        )}
      </div>
    </header>
  );
}
