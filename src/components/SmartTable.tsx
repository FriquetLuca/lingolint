import DroppingBackground from './DroppingBackground';

interface SmartTableProps {
  columnCount: number;
  handleDragOver?: React.DragEventHandler<HTMLElement> | undefined;
  handleDragLeave?: React.DragEventHandler<HTMLElement> | undefined;
  handleDrop?: React.DragEventHandler<HTMLElement> | undefined;
  children: React.ReactNode;
  gridTemplateColumns: string;
}

export default function SmartTable({
  children,
  columnCount,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  gridTemplateColumns,
}: SmartTableProps) {
  return (
    <main
      className="flex-1 overflow-auto min-w-full pb-6 bg-slate-950"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {columnCount === 0 ? (
        <DroppingBackground />
      ) : (
        <div className="inline-block align-middle">
          <div
            className="grid border border-slate-800 bg-slate-900 relative"
            style={{
              gridTemplateColumns,
              overflow: 'visible',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </main>
  );
}
