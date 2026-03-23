import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SmartKeyCellProps {
  translationKey: string;
  isNew?: boolean;
  onDelete: (keyToDelete: string) => void;
}

export default function SmartKeyCell({
  translationKey,
  isNew,
  onDelete,
}: SmartKeyCellProps) {
  const { t } = useTranslation();
  return (
    <div className="sticky left-0 z-30 min-h-full flex items-stretch">
      <div className="w-full sticky left-0 z-10 p-2 bg-slate-900 border-b border-r border-slate-700 group-hover:bg-slate-800 transition-colors flex justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-[11px] text-blue-400 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/50 font-mono break-all leading-relaxed">
            {translationKey}
          </code>

          {isNew && (
            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter animate-pulse border border-emerald-500/20">
              {t('smart_key_cell.new')}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(translationKey)}
          className="px-1 py-0.5 group-hover/key:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
          title={t('smart_key_cell.delete')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
