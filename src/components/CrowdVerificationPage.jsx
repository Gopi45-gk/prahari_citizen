import React, { useState, useEffect } from 'react';
import { Users, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useTranslation } from '../i18n/useTranslation';

export default function CrowdVerificationPage() {
  const { t } = useTranslation();
  const [verified, setVerified] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const q = query(collection(db, 'reports'), where('status', '==', 'Pending'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setTask({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (error) {
        console.error("Error fetching verification task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, []);

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('feedbackRecorded')}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          {t('thanksForVerifying')}
        </p>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 inline-block text-purple-700 dark:text-purple-300 font-medium">
          +10 {t('safetyPoints')} Earned
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <p className="text-slate-500 font-medium">{t('loading') || 'Loading tasks...'}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('allCaughtUp') || 'All Caught Up!'}</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-md">
          {t('noPendingVerifications') || 'There are no pending verification tasks in your area.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        
        <div className="bg-orange-500 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">{t('crowdVerificationNeeded')}</h2>
          <p className="text-orange-100 text-sm">{t('safetyAdvisoryMessage')}</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{task.location || 'Reported Location'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Approx. 50m from you</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t('viewDetails')}</h3>
            <p className="text-lg font-semibold text-slate-800 dark:text-white mb-1">{task.category || 'Hazard Report'}</p>
            <p className="text-slate-600 dark:text-slate-300">{task.description || 'No description provided.'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm font-medium">
              <span className="text-orange-600 dark:text-orange-400">{t('severity')}: {task.riskLevel || 'Medium'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400">Recently reported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={() => setVerified(true)}
              className="py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              {t('confirmIssue')}
            </button>
            <button 
              onClick={() => setVerified(true)}
              className="py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-5 h-5" />
              {t('notSeenFalseReport')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
