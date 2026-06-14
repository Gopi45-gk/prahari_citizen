import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import LoginPage from './components/LoginPage';
import AppShell from './components/AppShell';
import { applyTheme, defaultThemeSettings } from './utils/theme';
import { useTranslation } from './i18n/useTranslation';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setAppStage("language");
    }, 2500);

    const savedTheme = safeParse('prahari_theme_settings', defaultThemeSettings);
    applyTheme(savedTheme);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        let firestoreUser = {};

        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            firestoreUser = docSnap.data();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setUser({
          uid: firebaseUser.uid,
          name: firestoreUser.name || firebaseUser.displayName || firebaseUser.email || "Guest",
          email: firebaseUser.email,
          safetyPoints: firestoreUser.safetyPoints || 0,
          verifiedReports: firestoreUser.verifiedReports || 0,
          communityRank: firestoreUser.communityRank || 0,
          role: firestoreUser.role || "Passenger"
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
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

          if (!isAuthenticated) {
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
        onLogout={async () => {
          await signOut(auth);
          setAppStage("login");
        }}
      />
    );
  }

  return null; // Fallback for any intermediate states
}

export default App;
