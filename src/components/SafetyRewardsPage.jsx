import React from 'react';
import { Award, Shield, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function SafetyRewardsPage({ user }) {
  const { t } = useTranslation();
  
  const badges = [
    { id: 'watcher', name: t('safetyWatcher'), icon: Shield, color: 'text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30', earned: true },
    { id: 'guardian', name: t('railGuardian'), icon: Star, color: 'text-yellow-500 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30', earned: true },
    { id: 'reporter', name: t('emergencyReporter'), icon: AlertTriangleIcon, color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/30', earned: false },
    { id: 'protector', name: t('communityProtector'), icon: UsersIcon, color: 'text-green-500 bg-green-100 dark:text-green-400 dark:bg-green-900/30', earned: false },
    { id: 'champion', name: t('prahariChampion'), icon: Award, color: 'text-purple-500 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30', earned: false },
  ];

  function AlertTriangleIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> }
  function UsersIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
          <p className="text-purple-100 font-medium mb-1">{t('safetyPoints')}</p>
          <h2 className="text-4xl font-bold mb-2">{user?.safetyPoints || 0}</h2>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/20 text-xs font-semibold">
            <TrendingUp className="w-3 h-3" /> +40 this week
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t('verifiedReports')}</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.verifiedReports || 0}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t('communityRank')}</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">#{user?.communityRank || '-'}</h2>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t('badges')}</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map(badge => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-2xl border ${badge.earned ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50' : 'border-dashed border-slate-200 dark:border-slate-700 opacity-50 grayscale'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${badge.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <p className="font-semibold text-sm text-slate-800 dark:text-white leading-tight">{badge.name}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
