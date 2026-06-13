import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, ShieldAlert, AlertTriangle, Clock, Check } from 'lucide-react';
import { getItem, setItem } from '../utils/storage';
import { demoNotifications } from '../data/demoData';
import { useTranslation } from '../i18n/useTranslation';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const localNotifs = getItem('prahari_notifications', []);
    setNotifications([...localNotifs, ...demoNotifications]);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setItem('prahari_notifications', updated.filter(n => typeof n.id === 'number' && n.id > 100)); // Just a simplistic save for local ones
  };

  const getIcon = (keyOrText) => {
    const text = String(keyOrText || '').toLowerCase();
    if (text.includes('sos')) return <ShieldAlert className="w-5 h-5 text-red-600" />;
    if (text.includes('verif') || text.includes('resolv')) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (text.includes('advis') || text.includes('inspect')) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <Bell className="w-5 h-5 text-blue-600" />;
  };

  const getColor = (keyOrText) => {
    const text = String(keyOrText || '').toLowerCase();
    if (text.includes('sos')) return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    if (text.includes('verif') || text.includes('resolv')) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (text.includes('advis') || text.includes('inspect')) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('notifications')}</h2>
        <button 
          onClick={markAllRead}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center hover:underline"
        >
          <Check className="w-4 h-4 mr-1" /> {t('markAllRead')}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl flex items-start gap-4 transition-colors ${
              notif.read 
                ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-70' 
                : 'bg-blue-50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-600 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getColor(notif.messageKey || notif.text)}`}>
              {getIcon(notif.messageKey || notif.text)}
            </div>
            <div className="flex-1 pt-0.5">
              <p className={`text-sm ${notif.read ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-800 dark:text-white font-bold'}`}>
                {t(notif.messageKey || notif.text)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Just now
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
