interface ResizeHandleProps {
  onResize: (width: number) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth =
      (e.target as HTMLElement).parentElement?.offsetWidth || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (moveEvent.pageX - startX));
      onResize(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-10"
    />
  );
}
