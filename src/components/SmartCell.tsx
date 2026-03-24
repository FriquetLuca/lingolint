import { useEffect, useRef, useState } from 'react';
import { moveLine } from '../utils/moveLine';
import { textAreaTab } from '../utils/textAreaTab';
import { moveCursorToLineEdge } from '../utils/moveCursorToLineEdge';
import { moveCursorWord } from '../utils/moveCursorWord';
import ResizeHandle from './ResizeHandle';

interface SmartCellProps {
  value: string;
  fileName: string;
  translationKey: string;
  onUpdate: (fileName: string, key: string, val: string) => void;
  filesCount: number;
  columnIndex: number;
  handleColumnResize: (index: number, newWidth: number) => void;
}

export function SmartCell({
  value,
  fileName,
  translationKey,
  onUpdate,
  filesCount,
  columnIndex,
  handleColumnResize,
}: SmartCellProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prevValue, setPrevValue] = useState(value);
  const [currentValue, setCurrentValue] = useState(value);

  // 2. If the prop 'value' changed (e.g., from an Undo action),
  // we update our local state immediately during the render phase.
  if (value !== prevValue) {
    setPrevValue(value);
    setCurrentValue(value);
  }

  const adjustHeight = () => {
    const node = textareaRef.current;
    if (node) {
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [currentValue, filesCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    moveLine({
      e,
      content: currentValue,
      textarea,
      setContent: setCurrentValue,
    });
    textAreaTab({ textarea, e, tabIndent: 4, setContent: setCurrentValue });
    moveCursorToLineEdge({ e, textarea });
    moveCursorWord({ e, textarea, content: currentValue });
  };

  return (
    <div className="p-1 h-full border-b border-r border-slate-700 relative group-hover:bg-slate-800 transition-colors">
      <div className="h-full w-full bg-cyan-950 rounded-2xl border border-slate-700">
        <textarea
          ref={textareaRef}
          value={currentValue}
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={(e) => onUpdate(fileName, translationKey, e.target.value)}
          className="w-full p-2 text-sm font-sans leading-tight outline-none block overflow-hidden resize-none bg-transparent text-slate-300 min-h-0 h-auto"
          style={{ minHeight: 'unset', height: 'auto' }}
          onInput={adjustHeight}
        />
      </div>
      <ResizeHandle onResize={(w) => handleColumnResize(columnIndex + 1, w)} />
    </div>
  );
}
