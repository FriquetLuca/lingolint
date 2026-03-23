interface KeyPathCellProps {
  translationKey: string;
  isNew?: boolean;
}

export const KeyPathCell = ({ translationKey, isNew }: KeyPathCellProps) => {
  return (
    <div className="w-full sticky left-0 z-10 p-4 bg-slate-900 border-t border-x border-slate-800 group-hover:bg-slate-800 transition-colors shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-[11px] text-blue-400 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/50 font-mono break-all leading-relaxed">
          {translationKey}
        </code>

        {isNew && (
          <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter animate-pulse border border-emerald-500/20">
            New
          </span>
        )}
      </div>
    </div>
  );
};
