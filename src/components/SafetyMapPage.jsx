import React, { useState } from 'react';
import { MapPin, Navigation, Filter, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function SafetyMapPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filters = [
    { id: 'all', label: t('all') },
    { id: 'critical', label: t('critical') },
    { id: 'nearby', label: t('nearby') },
    { id: 'verified', label: t('verified') },
    { id: 'resolved', label: t('resolved') },
  ];

  const mapAlerts = [
    {
      id: "MAP-001",
      titleKey: "trackObstructionAlert",
      riskKey: "critical",
      statusKey: "underVerification",
      distance: "2.1 km",
      type: "critical",
      x: "58%",
      y: "34%",
      color: "bg-red-500",
      shadow: "shadow-red-500/40"
    },
    {
      id: "MAP-002",
      titleKey: "fallenTreeAlert",
      riskKey: "medium",
      statusKey: "authorityNotifiedStatus",
      distance: "4.5 km",
      type: "nearby",
      x: "36%",
      y: "58%",
      color: "bg-orange-500",
      shadow: "shadow-orange-500/40"
    },
    {
      id: "MAP-003",
      titleKey: "coachDamageAlert",
      riskKey: "high",
      statusKey: "underAction",
      distance: "1.8 km",
      type: "verified",
      x: "68%",
      y: "50%",
      color: "bg-orange-500",
      shadow: "shadow-orange-500/40"
    },
    {
      id: "MAP-004",
      titleKey: "platformCrowdAlert",
      riskKey: "low",
      statusKey: "monitoring",
      distance: "1.2 km",
      type: "resolved",
      x: "78%",
      y: "70%",
      color: "bg-green-500",
      shadow: "shadow-green-500/40"
    }
  ];

  const filteredAlerts =
    activeFilter === "all"
      ? mapAlerts
      : mapAlerts.filter((alert) => alert.type === activeFilter);

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8">
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar flex-shrink-0">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-h-[420px] rounded-[2rem] bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M8 75 C25 55, 38 70, 52 48 S75 30, 92 18"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />
        </svg>

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute -inset-4"></div>
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500 relative z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {filteredAlerts.map(alert => (
          <button
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10 text-white border-2 border-white ${alert.color} ${alert.shadow}`}
            style={{ left: alert.x, top: alert.y }}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        ))}

        {/* Legend */}
        <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-700 pointer-events-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> {t('criticalAlert')}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span> {t('mediumRisk')}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> {t('resolvedAlert')}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> {t('advisory')}
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" aria-label={t('locateMe')}>
            <Navigation className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" aria-label={t('filterMap')}>
            <Filter className="w-5 h-5" />
          </button>
          <div className="flex flex-col rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-2">
            <button className="w-12 h-12 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700 font-bold text-xl" aria-label={t('mapZoomIn')}>+</button>
            <button className="w-12 h-12 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-xl" aria-label={t('mapZoomOut')}>-</button>
          </div>
        </div>

      </div>

      {/* Nearby Alert Cards */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {filteredAlerts.slice(0, 3).map(alert => (
            <div key={`card-${alert.id}`} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2 min-h-fit cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedAlert(alert)}>
               <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${alert.color.replace('bg-', '')}`}></div>
                  <span className="text-xs font-semibold uppercase text-slate-500">{t(alert.riskKey)}</span>
                  <span className="ml-auto text-xs font-medium text-slate-400">{alert.distance}</span>
               </div>
               <h3 className="font-semibold text-slate-800 dark:text-white leading-relaxed break-words font-sans">{t(alert.titleKey)}</h3>
               <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-auto">{t(alert.statusKey)}</div>
            </div>
         ))}
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className={`h-2 w-full ${selectedAlert.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${selectedAlert.color}`}>
                     <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-slate-500 block">{t(selectedAlert.riskKey)}</span>
                    <span className="text-xs text-slate-400">{selectedAlert.distance}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-relaxed break-words font-sans">{t(selectedAlert.titleKey)}</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-semibold mb-6">
                {t(selectedAlert.statusKey)}
              </div>
              
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all whitespace-normal text-center leading-snug">
                 {t('viewDetails')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
