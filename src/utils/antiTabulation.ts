type singlelineAntiTabulationProps = {
  selectionStart: number;
  tabIndent: number;
  startLineChar: number;
  endLineChar: number;
  content: string;
};

function singlelineAntiTabulation({
  selectionStart,
  tabIndent,
  startLineChar,
  endLineChar,
  content,
}: singlelineAntiTabulationProps) {
  const currentContent = content.slice(startLineChar, endLineChar);
  const leadingSpacesMatch = currentContent.match(/^ +/);
  const indentLevel = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0;
  if (indentLevel > 0) {
    const mod = indentLevel % tabIndent;
    const spacesToRemove = mod === 0 ? tabIndent : mod;
    const newLineContent = currentContent.slice(spacesToRemove);
    const beforeLine = content.slice(0, startLineChar);
    const afterLine = content.slice(endLineChar);
    const newContent = beforeLine + newLineContent + afterLine;
    const newCursorPos = selectionStart - spacesToRemove;
    return {
      content: newContent,
      newSelectionStart: newCursorPos,
      newSelectionEnd: newCursorPos,
    };
  }
  return null;
}

type multilineAntiTabulationProps = {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  tabIndent: number;
  startLineChar: number;
  endLineChar: number;
};

function multilineAntiTabulation({
  content,
  selectionStart,
  selectionEnd,
  tabIndent,
  startLineChar,
  endLineChar,
}: multilineAntiTabulationProps) {
  const before = content.slice(0, startLineChar);
  const after = content.slice(endLineChar);
  const selectedContent = content.slice(startLineChar, endLineChar);
  const lines = selectedContent.split('\n');

  let adjustedSelectionStart = selectionStart;
  let adjustedSelectionEnd = selectionEnd;
  let runningOffset = 0;

  const processedLines = lines.map((line) => {
    const match = line.match(/^ +/);
    const leadingSpaces = match ? match[0].length : 0;
    const spacesToRemove = Math.min(leadingSpaces, tabIndent);

    if (spacesToRemove > 0) {
      const lineOffsetStart = startLineChar + runningOffset;

      // Adjust selectionStart if it's in or after this line
      if (
        selectionStart > lineOffsetStart &&
        selectionStart <= lineOffsetStart + leadingSpaces
      ) {
        adjustedSelectionStart -= Math.min(
          selectionStart - lineOffsetStart,
          spacesToRemove
        );
      } else if (selectionStart > lineOffsetStart + leadingSpaces) {
        adjustedSelectionStart -= spacesToRemove;
      }

      // Adjust selectionEnd if it's in or after this line
      if (
        selectionEnd > lineOffsetStart &&
        selectionEnd <= lineOffsetStart + leadingSpaces
      ) {
        adjustedSelectionEnd -= Math.min(
          selectionEnd - lineOffsetStart,
          spacesToRemove
        );
      } else if (selectionEnd > lineOffsetStart + leadingSpaces) {
        adjustedSelectionEnd -= spacesToRemove;
      }
    }

    const newLine = line.slice(spacesToRemove);
    runningOffset += line.length + 1; // +1 for '\n'
    return newLine;
  });

  const newSelectedContent = processedLines.join('\n');
  const newContent = before + newSelectedContent + after;

  return {
    content: newContent,
    newSelectionStart: adjustedSelectionStart,
    newSelectionEnd: adjustedSelectionEnd,
  };
}

type antiTabulationProps = {
  textarea: HTMLTextAreaElement;
  tabIndent: number;
};

export function antiTabulation({ textarea, tabIndent }: antiTabulationProps) {
  const value = textarea.value;
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const startLineChar = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const maybeEndLineChar = value.indexOf('\n', selectionEnd);
  const endLineChar = maybeEndLineChar === -1 ? value.length : maybeEndLineChar;

  if (selectionStart === selectionEnd) {
    return singlelineAntiTabulation({
      tabIndent,
      selectionStart,
      startLineChar,
      endLineChar,
      content: value,
    });
  }
  return multilineAntiTabulation({
    content: value,
    selectionStart,
    selectionEnd,
    tabIndent,
    startLineChar,
    endLineChar,
  });
}
