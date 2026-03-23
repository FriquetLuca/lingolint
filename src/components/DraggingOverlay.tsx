import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DraggingOverlayProps {
  isDragging: boolean;
}

export default function DraggingOverlay({ isDragging }: DraggingOverlayProps) {
  const { t } = useTranslation();
  return (
    isDragging && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm pointer-events-none">
        <div className="p-12 border-2 border-dashed border-blue-400 rounded-3xl bg-slate-900 shadow-2xl flex flex-col items-center">
          <Upload size={48} className="text-blue-400 animate-bounce" />
          <p className="mt-4 text-xl font-bold text-blue-400">
            {t('dragging_overlay.release')}
          </p>
        </div>
      </div>
    )
  );
}
