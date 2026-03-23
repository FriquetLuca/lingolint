import { Download, TableIcon, Upload } from 'lucide-react';
import AddKeyInput from './AddKeyInput';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  isFileOpen: boolean;
  fileKeys: string[];
  handleDragOver?: React.DragEventHandler<HTMLElement> | undefined;
  handleDragLeave?: React.DragEventHandler<HTMLElement> | undefined;
  handleDrop?: React.DragEventHandler<HTMLElement> | undefined;
  addGlobalKey: (path: string) => void;
  addFiles: (newFiles: File[]) => Promise<void>;
  handleExport: () => Promise<void>;
}

export default function Header({
  isFileOpen,
  fileKeys,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  addGlobalKey,
  handleExport,
  addFiles,
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
        {isFileOpen && (
          <AddKeyInput
            onAdd={addGlobalKey}
            existingKeys={fileKeys}
            placeholder={t('header.key_placeholder')}
            buttonTitle={t('header.button_title')}
          />
        )}
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
