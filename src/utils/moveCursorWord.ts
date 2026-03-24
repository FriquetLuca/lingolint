type CharType = 'word' | 'whitespace' | 'punctuation';

function getCharType(char: string): CharType {
  if (/\s|\n/.test(char)) return 'whitespace';
  if (/\w/.test(char)) return 'word';
  return 'punctuation';
}

export function moveCursorWordRight(text: string, cursorPos: number): number {
  const len = text.length;
  if (cursorPos >= len) return cursorPos;

  let i = cursorPos;
  const char = text[i];
  const charType = getCharType(char);

  // For word or whitespace: skip over same-type group
  while (i < len && getCharType(text[i]) === charType) {
    i++;
  }

  return i;
}

export function moveCursorWordLeft(text: string, cursorPos: number): number {
  if (cursorPos === 0) return 0;

  let i = cursorPos - 1;

  const initialType = getCharType(text[i]);

  while (i > 0 && getCharType(text[i - 1]) === initialType) {
    i--;
  }

  return i;
}

interface MoveCursorWordProps {
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  textarea: HTMLTextAreaElement;
  content: string;
}

export function moveCursorWord({ e, textarea, content }: MoveCursorWordProps) {
  if (!e.ctrlKey || e.altKey || e.metaKey) return;

  let newPos: number | null = null;

  if (e.key === 'ArrowRight') {
    newPos = moveCursorWordRight(content, textarea.selectionStart);
  } else if (e.key === 'ArrowLeft') {
    newPos = moveCursorWordLeft(content, textarea.selectionStart);
  } else {
    return;
  }

  e.preventDefault();
  textarea.selectionStart = textarea.selectionEnd = newPos;
}
