import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import LoginPage from './components/LoginPage';
import AppShell from './components/AppShell';
import { applyTheme, defaultThemeSettings } from './utils/theme';
import { useTranslation } from './i18n/useTranslation';

const safeParse = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appStage, setAppStage] = useState("splash");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const { changeLanguage } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("appLang") || "en"
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("prahari_auth") === "true"
  );

  const [user, setUser] = useState(() =>
    safeParse("prahari_current_user", null)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);

      // Force language selection step always as requested
      setAppStage("language");
    }, 2500);

    const savedTheme = safeParse('prahari_theme_settings', defaultThemeSettings);
    applyTheme(savedTheme);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (appStage === "language") {
    return (
      <LanguageSelection
        selectedLanguage={selectedLanguage}
        onSelect={async (langCode) => {
          setSelectedLanguage(langCode);
          await changeLanguage(langCode);
          
          // Check auth ONLY after language selection has been successfully completed
          const savedAuth = localStorage.getItem("prahari_auth") === "true";
          const savedUser = safeParse("prahari_current_user", null);
          
          if (!savedAuth || !savedUser) {
            setAppStage("login");
          } else {
            setAppStage("app");
            setCurrentPage("dashboard");
          }
        }}
      />
    );
  }

  if (appStage === "login") {
    return (
      <LoginPage
        onLogin={(userData) => {
          localStorage.setItem("prahari_auth", "true");
          localStorage.setItem("prahari_current_user", JSON.stringify(userData));
          setIsAuthenticated(true);
          setUser(userData);
          setAppStage("app");
          setCurrentPage("dashboard");
        }}
      />
    );
  }

  if (appStage === "app") {
    if (!isAuthenticated || !user) {
      setTimeout(() => setAppStage("login"), 0);
      return null;
    }
    return (
      <AppShell
        currentLanguage={selectedLanguage}
        setLanguage={async (langCode) => {
          setSelectedLanguage(langCode);
          await changeLanguage(langCode);
        }}
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={() => {
          localStorage.removeItem("prahari_auth");
          localStorage.removeItem("prahari_current_user");
          setIsAuthenticated(false);
          setUser(null);
          setAppStage("login");
        }}
      />
    );
  }

  return null; // Fallback for any intermediate states
}

export default App;
