import { antiTabulation } from './antiTabulation';
import { tabulation } from './tabulation';

interface textAreaTabProps {
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  tabIndent: number;
  textarea: HTMLTextAreaElement;
  setContent: (content: string) => void;
}

export function textAreaTab({
  textarea,
  e,
  tabIndent,
  setContent,
}: textAreaTabProps) {
  if (e.key !== 'Tab') return;

  e.preventDefault();
  if (e.shiftKey) {
    const antitab = antiTabulation({
      tabIndent,
      textarea,
    });
    if (antitab) {
      setContent(antitab.content);
      requestAnimationFrame(() => {
        textarea.selectionStart = antitab.newSelectionStart;
        textarea.selectionEnd = antitab.newSelectionEnd;
      });
    }
  } else {
    const { content, newSelectionStart, newSelectionEnd } = tabulation({
      tabIndent,
      textarea,
    });
    setContent(content);
    requestAnimationFrame(() => {
      textarea.selectionStart = newSelectionStart;
      textarea.selectionEnd = newSelectionEnd;
    });
  }
}
