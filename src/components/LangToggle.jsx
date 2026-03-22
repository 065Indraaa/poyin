import { useLang } from '../context/LanguageContext';

export default function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      className="lang-toggle"
      onClick={toggleLang}
      aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      <span className={`lang-opt${lang === 'id' ? ' active' : ''}`}>ID</span>
      <span className="lang-sep">/</span>
      <span className={`lang-opt${lang === 'en' ? ' active' : ''}`}>EN</span>
    </button>
  );
}
