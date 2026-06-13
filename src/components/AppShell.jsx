import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';
import Header from './Header';
import Dashboard from './Dashboard';
import SOSPage from './SOSPage';
import ReportHazardPage from './ReportHazardPage';
import AIHazardScannerPage from './AIHazardScannerPage';
import SafetyMapPage from './SafetyMapPage';
import MyReportsPage from './MyReportsPage';
import CrowdVerificationPage from './CrowdVerificationPage';
import SafetyRewardsPage from './SafetyRewardsPage';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import { useTranslation } from '../i18n/useTranslation';
import { demoUser } from '../data/demoData';

export default function AppShell({ user, currentLanguage, setLanguage, onLogout }) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard t={t} setCurrentPage={setCurrentPage} user={user} />;
      case 'sos': return <SOSPage t={t} />;
      case 'report': return <ReportHazardPage t={t} setCurrentPage={setCurrentPage} />;
      case 'scanner': return <AIHazardScannerPage t={t} setCurrentPage={setCurrentPage} />;
      case 'map': return <SafetyMapPage t={t} />;
      case 'reports': return <MyReportsPage t={t} />;
      case 'crowd': return <CrowdVerificationPage t={t} />;
      case 'rewards': return <SafetyRewardsPage t={t} user={user} />;
      case 'notifications': return <NotificationsPage t={t} />;
      case 'profile': return <ProfilePage t={t} user={user} currentLanguage={currentLanguage} setLanguage={setLanguage} onLogout={onLogout} />;
      default: return <Dashboard t={t} setCurrentPage={setCurrentPage} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans dark:bg-slate-900 dark:text-slate-200 transition-colors">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          currentPage={currentPage} 
          user={user} 
          t={t} 
          currentLanguage={currentLanguage}
          setLanguage={setLanguage}
          setCurrentPage={setCurrentPage}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {renderPage()}
          </div>
        </main>
      </div>

      <BottomNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
      `}} />
    </div>
  );
}
