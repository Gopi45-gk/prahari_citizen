import React, { useState, useRef } from 'react';
import { Camera, MapPin, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { setItem, getItem } from '../utils/storage';
import { useTranslation } from '../i18n/useTranslation';

export default function ReportHazardPage({ setCurrentPage }) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setUploadedPhoto({
      file,
      name: file.name,
      preview: imageUrl,
      size: file.size
    });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Add to reports
    const reports = getItem('prahari_reports', []);
    reports.unshift({
      id: `PRH-${Math.floor(Math.random() * 9000) + 1000}`,
      category: 'Track Damage',
      status: 'Submitted',
      aiConfidence: 'Pending'
    });
    setItem('prahari_reports', reports);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('reportSuccess')}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          {t('aiVerificationInProgress')}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => setCurrentPage('reports')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
          >
            {t('myReports')}
          </button>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-colors"
          >
            {t('reportNow')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('reportHazard')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('reportSafetyIssues')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('hazardCategory')}</label>
            <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">{t('selectCategory')}</option>
              <option value="track">{t('trackDamage')}</option>
              <option value="signal">{t('signalVisibilityIssue')}</option>
              <option value="tree">{t('fallenTree')}</option>
              <option value="platform">{t('platformSafetyIssue')}</option>
              <option value="animal">{t('animalIntrusion')}</option>
              <option value="water">{t('waterlogging')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('severityLevel')}</label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map(sev => (
                <label key={sev} className="cursor-pointer">
                  <input type="radio" name="severity" value={sev} className="peer sr-only" required />
                  <div className={`text-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium transition-colors peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 dark:peer-checked:bg-blue-900/30 dark:peer-checked:text-blue-400`}>
                    {t(sev)}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('location')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder={t('nearbyStation')} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <button type="button" className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">{t('autoDetectLocation')}</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('description')}</label>
            <textarea rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder={t('provideMoreDetails')}></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("uploadPhoto")}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {!uploadedPhoto ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all p-8 flex flex-col items-center justify-center text-center"
              >
                <Upload className="h-8 w-8 text-slate-400 mb-3" />
                <p className="font-semibold text-slate-800">
                  {t("clickToUploadPhoto")}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {t("imageUploadHint")}
                </p>
              </button>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={uploadedPhoto.preview}
                    alt="Uploaded hazard evidence"
                    className="h-24 w-24 rounded-xl object-cover border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">
                      {t("photoAttached")}
                    </p>
                    <p className="text-sm text-slate-500 break-all">
                      {uploadedPhoto.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadedPhoto(null)}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">
            {t('submitReport')}
          </button>
        </form>

      </div>
    </div>
  );
}
