import React, { useState } from 'react';
import { Palette, X, Moon, Sun, Monitor, Check } from 'lucide-react';
import { getItem, setItem } from '../utils/storage';
import { defaultThemeSettings, applyTheme } from '../utils/theme';
import { useTranslation } from '../i18n/useTranslation';

export default function ThemeCustomizationPanel({ onClose }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(() => getItem('prahari_theme_settings', defaultThemeSettings));

  const handleSave = () => {
    setItem('prahari_theme_settings', settings);
    applyTheme(settings);
    onClose();
  };

  const handleReset = () => {
    setSettings(defaultThemeSettings);
    setItem('prahari_theme_settings', defaultThemeSettings);
    applyTheme(defaultThemeSettings);
    onClose();
  };

  const appearances = [
    { id: 'light', icon: Sun, label: t('lightMode') },
    { id: 'dark', icon: Moon, label: t('darkMode') },
    { id: 'system', icon: Monitor, label: t('systemDefault') }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('themeCustomization')}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
          
          {/* Appearance */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('appearanceMode')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {appearances.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSettings({...settings, appearance: mode.id})}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    settings.appearance === mode.id 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <mode.icon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color (MVP simple selection) */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('accentColor')}</h3>
            <div className="flex gap-3">
              {['blue', 'red', 'green', 'purple', 'orange', 'teal'].map(color => (
                <button
                  key={color}
                  onClick={() => setSettings({...settings, accentColor: color})}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none`}
                  style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
                >
                  {settings.accentColor === color && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
          <button 
            onClick={handleReset}
            className="flex-1 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
          >
            {t('resetTheme')}
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all"
          >
            {t('save')}
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
