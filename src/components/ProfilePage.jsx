import React, { useState } from 'react';
import { User, Shield, MapPin, Phone, Bell, Globe, Palette, LogOut, ChevronRight, Check } from 'lucide-react';
import ThemeCustomizationPanel from './ThemeCustomizationPanel';
import { useTranslation } from '../i18n/useTranslation';

export default function ProfilePage({ user, currentLanguage, setLanguage, onLogout }) {
  const { t } = useTranslation();
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  
  const [settings, setSettings] = useState({
    locationAccess: true,
    notifications: true,
    offlineMode: false,
    emergencyContact: true
  });

  const toggleSetting = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in relative">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-5">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
          <User className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name || 'Citizen User'}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{user?.role || 'Passenger'}</p>
          <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
            <Shield className="w-4 h-4" />
            {t('communityProtector')}
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('settings')}</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          
          <button 
            onClick={() => setShowLanguagePanel(!showLanguagePanel)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{t('changeLanguage')}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-sm font-semibold uppercase">{currentLanguage}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {showLanguagePanel && (
            <div className="p-4 bg-slate-50 dark:bg-slate-700/30 grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-700">
              {[
                { code: "en", name: "English" },
                { code: "hi", name: "हिन्दी" },
                { code: "ta", name: "தமிழ்" },
                { code: "te", name: "తెలుగు" },
                { code: "kn", name: "ಕನ್ನಡ" },
                { code: "ml", name: "മലയാളം" },
                { code: "mr", name: "मराठी" },
                { code: "bn", name: "বাংলা" },
                { code: "gu", name: "ગુજરાતી" },
                { code: "pa", name: "ਪੰਜਾਬੀ" },
                { code: "or", name: "ଓଡ଼ିଆ" },
                { code: "as", name: "অসমীয়া" },
                { code: "ur", name: "اردو" },
                { code: "sa", name: "संस्कृतम्" },
                { code: "kok", name: "कोंकणी" },
                { code: "mni", name: "মৈতৈলোন্" },
                { code: "ne", name: "नेपाली" },
                { code: "brx", name: "बड़ो" },
                { code: "doi", name: "डोगरी" },
                { code: "ks", name: "کشمیری" },
                { code: "mai", name: "मैथिली" },
                { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ" },
                { code: "sd", name: "سنڌي" }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLanguagePanel(false); }}
                  className={`p-3 rounded-xl flex items-center justify-between transition-colors ${
                    currentLanguage === lang.code 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang.name}
                  {currentLanguage === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => setShowThemePanel(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{t('themeCustomization')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{t('enableLocationAccess')}</span>
            </div>
            <ToggleSwitch checked={settings.locationAccess} onChange={() => toggleSetting('locationAccess')} />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{t('enableSafetyNotifications')}</span>
            </div>
            <ToggleSwitch checked={settings.notifications} onChange={() => toggleSetting('notifications')} />
          </div>

        </div>

      </div>

      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shadow-sm"
      >
        <LogOut className="w-5 h-5" />
        {t('logout')}
      </button>

      {showThemePanel && <ThemeCustomizationPanel t={t} onClose={() => setShowThemePanel(false)} />}
    </div>
  );
}
