import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { 
  LayoutDashboard, ShieldAlert, AlertTriangle, ScanLine, 
  Map as MapIcon, FileText, Users, Award, Bell, User
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const { t } = useTranslation();
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'sos', icon: ShieldAlert, label: t('sosAlert'), color: 'text-red-500' },
    { id: 'report', icon: AlertTriangle, label: t('reportHazard'), color: 'text-orange-500' },
    { id: 'scanner', icon: ScanLine, label: t('aiHazardScanner'), color: 'text-purple-500' },
    { id: 'map', icon: MapIcon, label: t('railwaySafetyMap'), color: 'text-blue-500' },
    { id: 'reports', icon: FileText, label: t('myReports') },
    { id: 'crowd', icon: Users, label: t('crowdVerification') },
    { id: 'rewards', icon: Award, label: t('safetyRewards') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 dark:text-white leading-tight">PRAHARI</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Citizen</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm font-medium leading-relaxed break-words text-left ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : item.color || 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
