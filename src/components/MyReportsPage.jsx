import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight, Filter } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTranslation } from '../i18n/useTranslation';

export default function MyReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(
          collection(db, 'reports'),
          where("userId", "==", auth.currentUser ? auth.currentUser.uid : 'anonymous')
        );
        const querySnapshot = await getDocs(q);
        const fetchedReports = [];
        querySnapshot.forEach((doc) => {
          fetchedReports.push(doc.data());
        });
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': case 'Resolved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'crowdVerified': case 'Crowd Verified': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'underAction': case 'Under Action': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      default: return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      case 'crowdVerified': case 'Crowd Verified': return <AlertCircle className="w-4 h-4" />;
      case 'underAction': case 'Under Action': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filters = ['all', 'submitted', 'underAction', 'resolved'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {t(f)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reports.filter(r => filter === 'all' || 
          (filter === 'submitted' && (r.statusKey === 'submitted' || r.status === 'Submitted')) ||
          (filter === 'underAction' && (r.statusKey === 'underAction' || r.status === 'Under Action')) ||
          (filter === 'resolved' && (r.statusKey === 'resolved' || r.status === 'Resolved'))
        ).map((report, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t(report.categoryKey || report.category)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('reportId')}: {report.id} • {t('aiConfidence') || 'AI Confidence'}: {report.aiConfidence}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 border-slate-100 dark:border-slate-700 pt-3 sm:pt-0">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(report.statusKey || report.status)}`}>
                {getStatusIcon(report.statusKey || report.status)}
                {t(report.statusKey || report.status)}
              </div>
              <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center hover:underline">
                {t('viewDetails')} <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
