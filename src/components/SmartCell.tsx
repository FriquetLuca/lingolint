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
      // 1. Reset to allow shrinking
      node.style.height = 'auto';
      // 2. Set to scrollHeight to match content
      node.style.height = `${node.scrollHeight}px`;
    }
  };

  // Trigger resize when:
  // 1. The value changes
  // 2. A NEW file is added (filesCount changes)
  // 3. The component first mounts
  useEffect(() => {
    // We use requestAnimationFrame to ensure the DOM has
    // painted the new Grid columns before we measure.
    const offset = requestAnimationFrame(() => {
      adjustHeight();
    });
    return () => cancelAnimationFrame(offset);
  }, [value, filesCount]);

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="p-1 h-full border-t border-l border-slate-800 relative group-hover:bg-slate-800/10 transition-colors">
      <div className="p-1 h-full w-full bg-red-600/10 rounded-2xl">
        <textarea
          ref={textareaRef}
          defaultValue={value}
          rows={1} // CRITICAL: Tells the browser to start at 1-line height
          onBlur={(e) => onUpdate(fileName, translationKey, e.target.value)}
          className={`
            w-full p-2 text-sm font-sans leading-tight outline-none block overflow-hidden
            resize-none bg-transparent text-slate-300 min-h-0 h-auto
          `}
          style={{ minHeight: 'unset', height: 'auto' }} // Inline override to beat Tailwind/Global CSS
          onInput={adjustHeight}
        />
      </div>
    </div>
  );
};
