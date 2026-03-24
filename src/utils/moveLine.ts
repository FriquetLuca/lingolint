interface moveLineProps {
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  textarea: HTMLTextAreaElement;
  content: string;
  setContent: (content: string) => void;
}

// Alt+Up/Down to move line(s)
export function moveLine({ e, content, textarea, setContent }: moveLineProps) {
  let direction: 'up' | 'down' | null = null;
  if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    direction =
      e.key === 'ArrowUp' ? 'up' : e.key === 'ArrowDown' ? 'down' : null;
    if (direction === null) return;
    e.preventDefault();
  } else {
    return;
  }

  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const allLines = content.split('\n');

  // Determine start and end lines of selection
  const startLineIndex =
    content.slice(0, selectionStart).split('\n').length - 1;
  const endLineIndex = content.slice(0, selectionEnd).split('\n').length - 1;

  // Do not move if at boundaries
  if (direction === 'up' && startLineIndex === 0) return;
  if (direction === 'down' && endLineIndex === allLines.length - 1) return;

  const beforeLines = allLines.slice(0, startLineIndex);
  const selectedLines = allLines.slice(startLineIndex, endLineIndex + 1);
  const afterLines = allLines.slice(endLineIndex + 1);

  let newLines: string[] = [];
  let newStart = selectionStart;
  let newEnd = selectionEnd;

  if (direction === 'up') {
    const lineAbove = beforeLines.pop();
    if (lineAbove === undefined) return;
    newLines = [...beforeLines, ...selectedLines, lineAbove, ...afterLines];
    const offset = lineAbove.length + 1;
    newStart -= offset;
    newEnd -= offset;
  } else {
    const lineBelow = afterLines.shift();
    if (lineBelow === undefined) return;
    newLines = [...beforeLines, lineBelow, ...selectedLines, ...afterLines];
    const offset = lineBelow.length + 1;
    newStart += offset;
    newEnd += offset;
  }

  const updatedContent = newLines.join('\n');
  setContent(updatedContent);

  // Maintain cursor position
  requestAnimationFrame(() => {
    textarea.selectionStart = newStart;
    textarea.selectionEnd = newEnd;
  });
}
