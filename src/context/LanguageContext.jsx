import { createContext, useState, useContext, useCallback } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id'); // 'id' = Indonesia, 'en' = English

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  }, []);

  const t = useCallback((id_text, en_text) => {
    return lang === 'id' ? id_text : en_text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
