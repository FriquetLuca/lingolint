import { useState, useCallback } from 'react';

export interface HistoryStep {
  label: string;
  redo: () => void;
  undo: () => void;
}

const MAX_HISTORY = 100;

export function useHistory() {
  const [index, setIndex] = useState(-1);
  const [stack, setStack] = useState<HistoryStep[]>([]);

  const pushStep = useCallback(
    (step: HistoryStep) => {
      step.redo();
      setStack((prev) => {
        let newStack = prev.slice(0, index + 1);
        newStack = [...newStack, step];
        if (newStack.length > MAX_HISTORY) {
          return newStack.slice(1);
        }
        return newStack;
      });

      setIndex((prev) => {
        if (index + 1 >= MAX_HISTORY) {
          return MAX_HISTORY - 1;
        }
        return prev + 1;
      });
    },
    [index]
  );

  const undo = useCallback(() => {
    if (index >= 0 && stack[index]) {
      stack[index].undo();
      setIndex((prev) => prev - 1);
    }
  }, [index, stack]);

  const redo = useCallback(() => {
    const nextIndex = index + 1;
    if (nextIndex < stack.length && stack[nextIndex]) {
      stack[nextIndex].redo();
      setIndex(nextIndex);
    }
  }, [index, stack]);

  return {
    pushStep,
    undo,
    redo,
    canUndo: index >= 0,
    canRedo: index < stack.length - 1,
  };
}
