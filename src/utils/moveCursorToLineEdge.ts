interface moveCursorToLineEdgeProps {
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  textarea: HTMLTextAreaElement;
}

export function moveCursorToLineEdge({
  e,
  textarea,
}: moveCursorToLineEdgeProps) {
  if (
    e.ctrlKey ||
    !e.altKey ||
    (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')
  )
    return;

  e.preventDefault();
  const { selectionStart, selectionEnd, value } = textarea;

  // Find line boundaries
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const lineEnd = value.indexOf('\n', selectionStart);
  const lineEndPos = lineEnd === -1 ? value.length : lineEnd;

  const line = value.slice(lineStart, lineEndPos);

  const firstNonWhitespaceOffset = line.search(/\S|$/); // start boundary
  const indentStart = lineStart + firstNonWhitespaceOffset;

  const lastNonWhitespaceOffset = line.search(/\s*$/); // logical end (before trailing whitespace)
  const logicalLineEnd = lineStart + lastNonWhitespaceOffset;

  let newStart = selectionStart;
  let newEnd = selectionEnd;

  if (e.key === 'ArrowLeft') {
    if (e.shiftKey) {
      if (selectionStart !== indentStart) {
        newStart = selectionStart;
        newEnd = indentStart;
      } else {
        newStart = selectionStart;
        newEnd = lineStart;
      }
    } else {
      if (selectionStart !== indentStart) {
        newStart = newEnd = indentStart;
      } else {
        newStart = newEnd = lineStart;
      }
    }
  }

  if (e.key === 'ArrowRight') {
    if (e.shiftKey) {
      if (selectionEnd !== logicalLineEnd) {
        newStart = selectionStart;
        newEnd = logicalLineEnd;
      } else {
        newStart = selectionStart;
        newEnd = lineEndPos;
      }
    } else {
      if (selectionStart !== logicalLineEnd) {
        newStart = newEnd = logicalLineEnd;
      } else {
        newStart = newEnd = lineEndPos;
      }
    }
  }

  requestAnimationFrame(() => {
    textarea.selectionStart = newStart;
    textarea.selectionEnd = newEnd;
  });
}
