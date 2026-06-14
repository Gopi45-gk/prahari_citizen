import React from 'react';
import { 
  ShieldAlert, AlertTriangle, ScanLine, Map as MapIcon, 
  ChevronRight, Activity, Award, CheckCircle, Clock, Users 
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useTranslation } from '../i18n/useTranslation';

export default function Dashboard({ setCurrentPage, user }) {
  const { t } = useTranslation();
  const [recentAlerts, setRecentAlerts] = React.useState([]);

  React.useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const alerts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentAlerts(alerts);
      } catch (error) {
        console.error("Error fetching recent alerts:", error);
      }
    };

    fetchRecentAlerts();
  }, []);
  
  const stats = [
    { label: t('safetyPoints'), value: user?.safetyPoints || 0, icon: Award, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: t('verifiedReports'), value: user?.verifiedReports || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: t('nearby'), value: 4, icon: MapIcon, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: t('status'), value: 'Active', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  const actions = [
    { id: 'sos', title: t('sosAlert'), subtitle: t('sendEmergencyAlert'), icon: ShieldAlert, color: 'bg-red-500', hover: 'hover:bg-red-600' },
    { id: 'report', title: t('reportHazard'), subtitle: t('reportSafetyIssues'), icon: AlertTriangle, color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    { id: 'scanner', title: t('aiHazardScanner'), subtitle: t('uploadDetectHazards'), icon: ScanLine, color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    { id: 'map', title: t('railwaySafetyMap'), subtitle: t('viewNearbyAlerts'), icon: MapIcon, color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              {t('railwaySafetyActive')}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('welcome')}, {user?.name?.split(' ')[0] || 'Citizen'}
            </h1>
            <p className="text-blue-100 max-w-md leading-relaxed">
              {t('verifiedCommunity')}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <img src="https://www.image2url.com/r2/default/images/1781374103002-763403db-2fbb-4269-bf0f-37d8201d82c2.png" alt="Logo" className="w-12 h-12 object-contain mb-2" />
            <span className="text-sm font-semibold">{t('appName')}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => setCurrentPage(action.id)}
            className={`${action.color} ${action.hover} text-left rounded-3xl p-6 text-white shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
              <action.icon className="w-24 h-24 -mr-6 -mt-6" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lower Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('recentSafetyAlerts')}</h3>
            <button onClick={() => setCurrentPage('map')} className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center hover:underline">
              {t('all')} <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {recentAlerts.length > 0 ? recentAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                  alert.riskLevel === 'Critical' ? 'bg-red-500' : alert.riskLevel === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{alert.category}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.status || 'Pending'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                {t('noRecentAlerts') || 'No recent alerts found'}
              </div>
            )}
          </div>
        </div>

        {/* Crowd Verification Needed */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('crowdVerificationNeeded')}</h3>
            <button onClick={() => setCurrentPage('crowd')} className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center hover:underline">
              {t('openMap')} <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl p-4 flex gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-800 dark:text-orange-300">{t('signalVisibilityIssue')}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 mb-2">{t('nearbyStation')}</p>
              <button onClick={() => setCurrentPage('crowd')} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
                {t('confirmIssue')}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
