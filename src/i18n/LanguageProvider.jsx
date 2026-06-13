import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { staticTranslations } from './translations';

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("appLang") || "en"
  );
  
  // Initialize correct layout on mount
  useEffect(() => {
    const code = localStorage.getItem("appLang") || "en";
    if (["ur", "sd", "ks"].includes(code)) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, []);

  const changeLanguage = useCallback(async (code) => {
    setSelectedLanguage(code);
    localStorage.setItem("appLang", code);

    if (["ur", "sd", "ks"].includes(code)) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, []);

  const t = useCallback((key) => {
    return staticTranslations?.[selectedLanguage]?.[key] || staticTranslations?.en?.[key] || key;
  }, [selectedLanguage]);

  const value = useMemo(() => ({
    selectedLanguage,
    changeLanguage,
    t,
    isTranslating: false
  }), [selectedLanguage, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
