import { useEffect, useRef } from 'react';

interface SmartCellProps {
  value: string;
  fileName: string;
  translationKey: string;
  onUpdate: (fileName: string, key: string, val: string) => void;
  filesCount: number;
}

export const SmartCell = ({
  value,
  fileName,
  translationKey,
  onUpdate,
  filesCount,
}: SmartCellProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const node = textareaRef.current;
    if (node) {
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const offset = requestAnimationFrame(() => {
      adjustHeight();
    });
    return () => cancelAnimationFrame(offset);
  }, [value, filesCount]);

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="p-1 h-full border-b border-r border-slate-700 relative group-hover:bg-slate-800 transition-colors">
      <div className="h-full w-full bg-cyan-950 rounded-2xl border border-slate-700">
        <textarea
          ref={textareaRef}
          defaultValue={value}
          rows={1}
          onBlur={(e) => onUpdate(fileName, translationKey, e.target.value)}
          className="w-full p-2 text-sm font-sans leading-tight outline-none block overflow-hidden resize-none bg-transparent text-slate-300 min-h-0 h-auto"
          style={{ minHeight: 'unset', height: 'auto' }}
          onInput={adjustHeight}
        />
      </div>
    </div>
  );
};
