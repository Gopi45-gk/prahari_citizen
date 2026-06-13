import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, MapPin, Camera, Mic, QrCode, X, CheckCircle, AlertOctagon, SwitchCamera } from 'lucide-react';
import { setItem, getItem } from '../utils/storage';
import { useTranslation } from '../i18n/useTranslation';

export default function SOSPage() {
  const { t } = useTranslation();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sosSent, setSosSent] = useState(false);
  const holdTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const [form, setForm] = useState({
    emergencyType: 'medicalEmergency',
    location: 'GPS Auto Detected',
    description: '',
    trainNumber: '',
    coachNumber: '',
    seatNumber: ''
  });

  const photoInputRef = useRef(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAttached, setVoiceAttached] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [toastMessage, setToastMessage] = useState("");

  // QR Scanner States
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrFacingMode, setQrFacingMode] = useState("environment");
  const [isExtractingQR, setIsExtractingQR] = useState(false);
  const qrVideoRef = useRef(null);
  const qrStreamRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(t("invalidImageFile") || "Please upload a valid image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setUploadedPhoto({
      file,
      name: file.name,
      preview: imageUrl,
      size: file.size
    });

    showToast(t("photoAttached") || "Photo attached successfully");
  };

  const handlePressStart = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    setIsHolding(true);
    setProgress(0);
    
    const startTime = Date.now();
    const duration = 3000;

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(progressTimerRef.current);
        triggerSOS();
      }
    }, 50);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
    clearInterval(progressTimerRef.current);
    if (progress < 100) {
      setProgress(0);
    }
  };

  const triggerSOS = () => {
    setIsHolding(false);
    setSosSent(true);

    const sosReport = {
      id: `PRH-SOS-${Date.now()}`,
      type: "SOS",
      emergencyType: form.emergencyType,
      trainNumber: form.trainNumber || "",
      coachNumber: form.coachNumber || "",
      seatNumber: form.seatNumber || "",
      location: form.location,
      description: form.description,
      hasPhoto: !!uploadedPhoto,
      hasVoiceNote: voiceAttached,
      statusKey: "sosSubmitted",
      severityKey: "critical",
      submittedAt: new Date().toISOString()
    };

    const existingReports = getItem('prahari_reports', []);
    existingReports.unshift(sosReport);
    setItem('prahari_reports', existingReports);

    const notifs = getItem('prahari_notifications', []);
    notifs.unshift({ id: Date.now(), messageKey: 'sosSubmitted', read: false });
    setItem('prahari_notifications', notifs);
  };

  // QR Scanner Logic
  const stopQRCamera = () => {
    if (qrStreamRef.current) {
      qrStreamRef.current.getTracks().forEach(track => track.stop());
      qrStreamRef.current = null;
    }
    setIsQRScannerOpen(false);
    setIsExtractingQR(false);
  };

  const openQRScanner = async () => {
    setIsQRScannerOpen(true);
    if (qrStreamRef.current) {
      qrStreamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: qrFacingMode } },
        audio: false
      });
      qrStreamRef.current = stream;
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      showToast(t("cameraPermissionDenied") || "Camera access denied");
      setIsQRScannerOpen(false);
    }
  };

  const toggleQRCamera = () => {
    setQrFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  useEffect(() => {
    if (isQRScannerOpen) {
      openQRScanner();
    }
  }, [qrFacingMode]);

  useEffect(() => {
    return () => {
      stopQRCamera();
      clearInterval(progressTimerRef.current);
    };
  }, []);

  const captureQR = () => {
    setIsExtractingQR(true);
    // Simulate extraction delay
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        trainNumber: "12625",
        coachNumber: "S4",
        seatNumber: "22"
      }));
      stopQRCamera();
      showToast(t("coachQRScanned") || "Coach details extracted successfully");
    }, 1500);
  };

  useEffect(() => {
    if (!isRecording) return;
  
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [isRecording]);

  if (sosSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 sos-ring">
          <AlertOctagon className="w-12 h-12 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{t('alertPriorityCritical')}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          {t('sosSubmitted')}
        </p>
        
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-left space-y-4">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{t('locationShared')}</span>
          </div>
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{t('controlRoomNotified')}</span>
          </div>
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{t('emergencyResponseInitiated')}</span>
          </div>
        </div>

        <button 
          onClick={() => setSosSent(false)}
          className="mt-8 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-colors"
        >
          {t('close')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in relative">
      
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-fade-in whitespace-nowrap">
          {toastMessage}
        </div>
      )}

      {/* QR Camera Modal */}
      {isQRScannerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-800 overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('scanQR') || "Scan Coach QR"}</h3>
              <div className="flex items-center gap-2">
                <button onClick={toggleQRCamera} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold">
                  <SwitchCamera className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('switchCamera')}</span>
                </button>
                <button onClick={stopQRCamera} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative bg-black aspect-[3/4] sm:aspect-video flex items-center justify-center">
              <video 
                ref={qrVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-4 border-blue-500/50 m-12 rounded-xl pointer-events-none"></div>
              {isExtractingQR && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col z-20">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-3"></div>
                  <p className="text-white font-semibold">{t('extractingDetails') || "Extracting details..."}</p>
                </div>
              )}
            </div>
            <div className="p-6 flex justify-center bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={captureQR}
                disabled={isExtractingQR}
                className={`w-16 h-16 rounded-full border-4 ${isExtractingQR ? 'border-slate-400 bg-slate-500 cursor-not-allowed' : 'border-blue-200 bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-500/40'} flex items-center justify-center transition-all`}
              >
                <QrCode className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-6 md:p-8 text-center flex flex-col items-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">{t('pressHoldSOS')}</h2>
        <p className="text-sm text-red-600 dark:text-red-300 mb-8 max-w-sm">
          {t('sosWarning')}
        </p>

        <div className="relative mb-4">
          <svg className="w-48 h-48 -rotate-90 transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <circle
              cx="96" cy="96" r="88"
              className="stroke-red-200 dark:stroke-red-900/50"
              strokeWidth="8" fill="none"
            />
            <circle
              cx="96" cy="96" r="88"
              className="stroke-red-600 transition-all duration-75 ease-linear"
              strokeWidth="8" fill="none"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>

          <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all ${
              isHolding ? 'bg-red-700 scale-95 shadow-inner' : 'bg-red-600 shadow-xl shadow-red-500/40 hover:bg-red-500'
            }`}
          >
            <ShieldAlert className="w-16 h-16 text-white mb-1" />
            <span className="text-white font-bold text-xl tracking-wider">SOS</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('emergencyType')}</label>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            value={form.emergencyType}
            onChange={(e) => setForm({...form, emergencyType: e.target.value})}
          >
            <option value="medicalEmergency">{t('medicalEmergency')}</option>
            <option value="fireSmoke">{t('fireSmoke')}</option>
            <option value="accidentRisk">{t('accidentRisk')}</option>
            <option value="womenSafety">{t('womenSafety')}</option>
            <option value="suspiciousActivity">{t('suspiciousActivity')}</option>
          </select>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800 dark:text-white">{t('gpsAutoDetected')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('location')}: Lat: 13.0827, Long: 80.2707 (Accuracy: 12m)</p>
          </div>
        </div>

        {form.trainNumber && (
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm">
            <p className="font-semibold text-slate-800 dark:text-white mb-1">{t('coachDetails') || "Coach Details Extracted:"}</p>
            <p className="text-slate-600 dark:text-slate-300">Train: <span className="font-bold">{form.trainNumber}</span></p>
            <p className="text-slate-600 dark:text-slate-300">Coach: <span className="font-bold">{form.coachNumber}</span></p>
            <p className="text-slate-600 dark:text-slate-300">Seat: <span className="font-bold">{form.seatNumber}</span></p>
          </div>
        )}

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all gap-2"
          >
            <Camera className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">{t('uploadPhoto')}</span>
          </button>
          <button 
            type="button"
            onClick={() => setShowVoiceModal(true)}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all gap-2"
          >
            <Mic className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">{t('addVoiceNote')}</span>
          </button>
          <button 
            type="button"
            onClick={openQRScanner}
            className="col-span-2 flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors gap-3"
          >
            <QrCode className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('scanCoachQR')}</span>
          </button>
        </div>

        {uploadedPhoto && (
          <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <div className="flex items-center gap-3">
              <img
                src={uploadedPhoto.preview}
                alt="Uploaded hazard evidence"
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {t("photoAttached") || "Photo attached"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 break-all truncate">
                  {uploadedPhoto.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadedPhoto(null)}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                {t("remove") || "Remove"}
              </button>
            </div>
          </div>
        )}

        {voiceAttached && (
          <div className="mt-4 rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-4 text-blue-800 dark:text-blue-300">
            <p className="font-semibold">
              {t("voiceNoteAttached")}
            </p>
          </div>
        )}
        
      </div>

      {showVoiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-800 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("addVoiceNote")}
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t("voiceNoteSubtitle") || "Record a short emergency voice note for the safety team."}
            </p>

            <div className="my-8 flex flex-col items-center">
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full transition-colors duration-300 ${
                  isRecording ? "bg-red-100 dark:bg-red-900/30 animate-pulse" : "bg-blue-50 dark:bg-blue-900/30"
                }`}
              >
                <Mic className={`h-12 w-12 transition-colors duration-300 ${isRecording ? "text-red-600 dark:text-red-500" : "text-blue-600 dark:text-blue-400"}`} />
              </div>

              <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {isRecording
                  ? `${t("recording") || "Recording"}... ${recordingSeconds}s`
                  : voiceAttached
                  ? t("voiceNoteAttached") || "Voice note attached"
                  : t("readyToRecord") || "Ready to record"}
              </p>
            </div>

            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsRecording(true);
                    setRecordingSeconds(0);
                  }}
                  className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 transition-colors"
                >
                  {t("startRecording") || "Start Recording"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsRecording(false);
                    setVoiceAttached(true);
                    setShowVoiceModal(false);
                    showToast(t("voiceNoteAttached") || "Voice note attached successfully");
                  }}
                  className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  {t("stopRecording") || "Stop Recording"}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsRecording(false);
                  setShowVoiceModal(false);
                }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
