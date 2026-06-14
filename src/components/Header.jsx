import React, { useState, useEffect } from 'react';
import { Bell, Globe, User } from 'lucide-react';
import { getItem } from '../utils/storage';
import { useTranslation } from '../i18n/useTranslation';
import { languages } from '../i18n/languages';

export default function Header({ currentPage, user, currentLanguage, setLanguage, setCurrentPage }) {
  const { t } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const localNotifs = getItem('prahari_notifications', []);
    setUnreadCount(localNotifs.filter(n => !n.read).length);
  }, [currentPage]);

  const pageTitles = {
    dashboard: t('dashboard'),
    sos: t('sosAlert'),
    report: t('reportHazard'),
    scanner: t('aiHazardScanner'),
    map: t('railwaySafetyMap'),
    reports: t('myReports'),
    crowd: t('crowdVerification'),
    rewards: t('safetyRewards'),
    notifications: t('notifications'),
    profile: t('profile'),
  };

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 py-4 flex items-center justify-between transition-colors">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white capitalize">
        {pageTitles[currentPage] || t('dashboard')}
      </h2>

      <div className="flex items-center gap-3 md:gap-4">
        
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium uppercase">{currentLanguage}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentLanguage === lang.code 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setCurrentPage('notifications')}
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          )}
        </button>

        <button 
          onClick={() => setCurrentPage('profile')}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </button>

      </div>
      
      {/* Click outside listener for language menu would ideally go here, simplifying for MVP */}
    </header>
  );
}
