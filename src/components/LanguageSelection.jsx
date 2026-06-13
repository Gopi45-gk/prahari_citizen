import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { setItem } from '../utils/storage';
import backgroundImage from '../assets/prahari-clean-train-bg.jpg';
import { useTranslation } from '../i18n/useTranslation';

import { languages } from '../i18n/languages';

export default function LanguageSelection({ onSelect }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelected] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedLanguage) {
      localStorage.setItem('appLang', selectedLanguage);
      onSelect(selectedLanguage);
    } else {
      setToastMessage("Please select a language to continue");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-no-repeat relative flex items-center justify-center p-4 font-sans overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.00), rgba(255,255,255,0.03)), url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat"
      }}
    >
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-fade-in whitespace-nowrap">
          <AlertCircle className="w-5 h-5" />
          {toastMessage}
        </div>
      )}
      <div className="w-full max-w-md lg:max-w-2xl max-h-[88vh] overflow-y-auto rounded-[2rem] bg-white/72 backdrop-blur-xl border border-white/60 shadow-2xl p-6 md:p-8 flex flex-col">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="https://www.image2url.com/r2/default/images/1781337580193-02063940-ebdc-4685-9858-cd2bc0eb30ca.png" alt="Logo" className="w-full h-full object-contain animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{t('chooseLanguage')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed break-words font-sans">{t('selectLanguageSubtitle')}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('searchLanguage')} 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-sans"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  selectedLanguage === lang.code 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white/90 hover:shadow-sm'
                }`}
              >
                <div className="text-lg font-medium leading-relaxed break-words">{lang.nativeName}</div>
                <div className={`text-sm ${selectedLanguage === lang.code ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {lang.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleContinue}
          className={`w-full py-4 mt-6 rounded-xl font-bold text-lg transition-all transform whitespace-normal text-center font-sans ${
            selectedLanguage 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 hover:-translate-y-1' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {t('continue')}
        </button>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
}
