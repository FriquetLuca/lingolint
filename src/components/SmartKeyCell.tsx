import { useTranslation } from 'react-i18next';

interface SmartKeyCellProps {
  translationKey: string;
  isNew?: boolean;
}

export default function SmartKeyCell({
  translationKey,
  isNew,
}: SmartKeyCellProps) {
  const { t } = useTranslation();
  return (
    <div className="sticky left-0 z-30 min-h-full flex items-stretch">
      <div className="w-full sticky left-0 z-10 p-2 bg-slate-900 border-b border-r border-slate-700 group-hover:bg-slate-800 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-[11px] text-blue-400 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/50 font-mono break-all leading-relaxed">
            {translationKey}
          </code>

          {isNew && (
            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter animate-pulse border border-emerald-500/20">
              {t('key_path_cell.new')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
