import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';

const LanguageContext = createContext();

export const useLanguageManager = () => useContext(LanguageContext);

export default function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  // Initialize RTL and correct language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("prahari_language") || "en";
    
    if (savedLanguage === "ur") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const changeAppLanguage = async (langCode) => {
    if (langCode === "ur") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    localStorage.setItem("prahari_language", langCode);
    i18n.changeLanguage(langCode);
  };

  return (
    <LanguageContext.Provider value={{ changeAppLanguage, isTranslating: false }}>
      {children}
    </LanguageContext.Provider>
  );
}
