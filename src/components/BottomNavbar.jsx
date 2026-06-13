import React from 'react';
import { Home, ShieldAlert, AlertTriangle, Map as MapIcon, User } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function BottomNavbar({ currentPage, setCurrentPage }) {
  const { t } = useTranslation();
  const navItems = [
    { id: 'dashboard', icon: Home, label: t('home') },
    { id: 'sos', icon: ShieldAlert, label: t('sos'), color: 'text-red-500' },
    { id: 'report', icon: AlertTriangle, label: t('report') },
    { id: 'map', icon: MapIcon, label: t('mapSubtitle').split(' ')[0] },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-end p-2 px-4 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isSOS = item.id === 'sos';
          
          if (isSOS) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="relative flex flex-col items-center justify-center -translate-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 border-4 border-white dark:border-slate-800 shadow-lg shadow-red-500/40 flex items-center justify-center sos-ring transition-transform hover:scale-105 active:scale-95">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className="flex flex-col items-center justify-center w-16 py-1"
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
              <span className={`text-[10px] font-medium mt-1 w-full text-center truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
