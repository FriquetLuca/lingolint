import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-800 border border-slate-700 rounded-sm">
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-2 py-1 tracking-tighter transition-all ${
          i18n.language.startsWith('en') ? 'bg-slate-700 rounded-sm' : ''
        }`}
      >
        🇬🇧
      </button>

      <div className="w-px h-3 bg-slate-700" />

      <button
        onClick={() => toggleLanguage('fr')}
        className={`px-2 py-1 tracking-tighter transition-all ${
          i18n.language.startsWith('fr') ? 'bg-slate-700 rounded-sm' : ''
        }`}
      >
        🇫🇷
      </button>
    </div>
  );
}
