interface singlelineTabulationProps {
  selectionStart: number;
  selectionEnd: number;
  tabIndent: number;
  startLineChar: number;
  content: string;
}

function singlelineTabulation({
  selectionStart,
  selectionEnd,
  tabIndent,
  startLineChar,
  content,
}: singlelineTabulationProps) {
  const cursorColumn = selectionStart - startLineChar;
  const mod = cursorColumn % tabIndent;
  const spacesToInsert = mod === 0 ? tabIndent : tabIndent - mod;
  const spaces = ' '.repeat(spacesToInsert);
  const before = content.slice(0, selectionStart);
  const after = content.slice(selectionEnd);
  const newContent = before + spaces + after;
  const newPos = selectionStart + spacesToInsert;
  return {
    content: newContent,
    newSelectionStart: newPos,
    newSelectionEnd: newPos,
  };
}

interface multilineTabulationProps {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  tabIndent: number;
  startLineChar: number;
  endLineChar: number;
}

function multilineTabulation({
  content,
  selectionStart,
  selectionEnd,
  tabIndent,
  startLineChar,
  endLineChar,
}: multilineTabulationProps) {
  const beginContentResult = content.slice(0, startLineChar);
  const endContentResult = content.slice(endLineChar);
  const selectedContent = content.slice(startLineChar, endLineChar);
  const spaceToAdd = ' '.repeat(tabIndent);
  const lines = selectedContent.split('\n');
  const currentContentResult = lines.map((c) => spaceToAdd + c).join('\n');
  return {
    content: beginContentResult + currentContentResult + endContentResult,
    newSelectionStart: selectionStart + tabIndent,
    newSelectionEnd: selectionEnd + lines.length * tabIndent,
  };
}

interface tabulationProps {
  textarea: HTMLTextAreaElement;
  tabIndent: number;
}

export function tabulation({ textarea, tabIndent }: tabulationProps) {
  const value = textarea.value;
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const startLineChar = value.lastIndexOf('\n', selectionStart - 1) + 1;
  if (selectionStart === selectionEnd) {
    return singlelineTabulation({
      tabIndent,
      selectionStart,
      selectionEnd,
      startLineChar,
      content: value,
    });
  }
  const maybeEndLineChar = value.indexOf('\n', selectionEnd);
  const endLineChar = maybeEndLineChar === -1 ? value.length : maybeEndLineChar;
  return multilineTabulation({
    selectionStart,
    selectionEnd,
    tabIndent,
    startLineChar,
    endLineChar,
    content: value,
  });
}
