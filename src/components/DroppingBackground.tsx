import { FileJson } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DroppingBackground() {
  const { t } = useTranslation();
  return (
    <div className="mt-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl py-24 bg-slate-900/50">
      <FileJson size={48} className="text-slate-600 mb-6" />
      <h2 className="text-xl font-semibold text-slate-300">
        {t('dropping_background.label')}
      </h2>
    </div>
  );
}
