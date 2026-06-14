import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, Upload, Camera, CheckCircle, AlertTriangle, X, RefreshCw, SwitchCamera } from 'lucide-react';
import { setItem, getItem } from '../utils/storage';
import { scanHazardWithAI } from '../services/aiScanner';
import { useTranslation } from '../i18n/useTranslation';

export default function AIHazardScannerPage({ setCurrentPage }) {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, result, submitted
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Camera Modal States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const openCamera = async () => {
    setErrorMsg('');
    setIsCameraOpen(true);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: facingMode } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(t("cameraPermissionDenied") || "Camera access denied. Please allow permissions.");
      setIsCameraOpen(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      openCamera();
    }
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      
      setImage(base64);
      setImageFile({ name: "captured_photo.jpg" });
      setScanningStatus('idle');
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      setErrorMsg(t("invalidImageFile") || "Please upload a valid JPG, PNG, or WEBP image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setImageFile(file);
      setScanningStatus('idle');
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const startScan = async () => {
    if (!image) {
      setErrorMsg(t("noImageSelected") || "Please select an image first.");
      return;
    }

    setScanningStatus('scanning');
    setScanProgress(0);
    setErrorMsg('');
    
    // Simulate progress bar moving up to 95% while waiting
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += (95 - progress) * 0.1; 
      setScanProgress(progress);
    }, 200);

    try {
      const result = await scanHazardWithAI(image);
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setScanResult(result);
        setScanningStatus('result');
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Scan error:", error);
      setErrorMsg(t("scanFailed") || "Failed to analyze image. Please try again.");
      setScanningStatus('idle');
    }
  };

  const handleSubmit = () => {
    setScanningStatus('submitted');
    const reports = getItem('prahari_reports', []);
    
    const categoryName = scanResult?.hazardType || 'AI Hazard Scan';
    const confScore = scanResult?.confidence || 'N/A';
    const risk = scanResult?.riskLevel || 'Unknown';
    const riskScore = scanResult?.riskScore || 0;

    reports.unshift({
      id: `PRH-AI-${Math.floor(Math.random() * 9000) + 1000}`,
      category: categoryName,
      status: 'Submitted',
      statusKey: 'submitted',
      aiConfidence: confScore,
      riskLevel: risk,
      riskScore: riskScore,
      description: scanResult?.aiExplanation || scanResult?.description || '',
      suggestedAction: scanResult?.recommendedAction || scanResult?.suggestedAction || '',
      operationalImpact: scanResult?.operationalImpact || '',
      source: "AI Hazard Scanner",
      createdAt: new Date().toISOString()
    });
    setItem('prahari_reports', reports);
    
    const notifs = getItem('prahari_notifications', []);
    notifs.unshift({ id: Date.now(), text: t('aiReportSubmitted'), read: false });
    setItem('prahari_notifications', notifs);
  };

  if (scanningStatus === 'submitted') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in p-6">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-purple-600 dark:text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('reportSuccess')}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
          {t('aiReportSubmitted')}
        </p>
        <button 
          onClick={() => { setImage(null); setImageFile(null); setScanningStatus('idle'); }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
        >
          {t('scanAnotherImage')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in relative">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-800 overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('captureCamera')}</h3>
              <div className="flex items-center gap-2">
                <button onClick={toggleCamera} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold">
                  <SwitchCamera className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('switchCamera')}</span>
                </button>
                <button onClick={stopCamera} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative bg-black aspect-[3/4] sm:aspect-video flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-6 flex justify-center bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-purple-200 bg-purple-600 flex items-center justify-center hover:bg-purple-700 hover:scale-105 transition-all shadow-lg shadow-purple-500/40"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <ScanLine className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('aiHazardScanner')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('aiScannerSubtitle')}</p>
          </div>
        </div>

        {!image && (
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('uploadImage')}</h3>
              <p className="text-sm text-slate-500">{t('tapToSelectFromGallery')}</p>
            </div>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">{t('or')}</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <button 
              onClick={openCamera}
              className="w-full py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="w-5 h-5" />
              {t('captureCamera')}
            </button>
          </div>
        )}

        {image && scanningStatus === 'idle' && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700 group">
              <img src={image} alt="Selected" className="object-cover w-full h-full opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => { setImage(null); setImageFile(null); }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('remove') || 'Change Image'}
                </button>
              </div>
            </div>
            {imageFile && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center truncate px-4">
                {imageFile.name}
              </p>
            )}
            <div className="flex gap-4">
              <button 
                onClick={() => { setImage(null); setImageFile(null); }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition-all"
              >
                {t('cancel')}
              </button>
              <button 
                onClick={startScan}
                className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <ScanLine className="w-5 h-5" />
                {t('analyzeImage')}
              </button>
            </div>
          </div>
        )}

        {scanningStatus === 'scanning' && (
          <div className="space-y-8 py-8">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <img src={image} alt="Scanning" className="object-cover w-full h-full opacity-50 blur-[2px]" />
              <div className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-scan z-10"></div>
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-600 animate-spin"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-purple-600 dark:text-purple-400">
                  {scanProgress < 25 ? t('uploadingImage') || "Uploading Image..." : 
                   scanProgress < 50 ? t('runningHazardDetection') || "Running Hazard Detection..." : 
                   scanProgress < 75 ? t('analyzingRisk') || "Analyzing Risk..." : 
                   t('generatingPrahariReport') || "Generating PRAHARI Report..."}
                </span>
                <span className="text-slate-500">{Math.round(scanProgress)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-75" style={{ width: `${scanProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {scanningStatus === 'result' && scanResult && (
          <div className="space-y-6 animate-fade-in py-2">
            
            <div className={`flex items-start gap-4 p-4 rounded-xl border ${
              scanResult.riskLevel === 'Critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' :
              scanResult.riskLevel === 'High' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800' :
              scanResult.riskLevel === 'Medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800' :
              'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
            }`}>
              {scanResult.riskLevel !== 'Low' ? (
                <AlertTriangle className={`w-8 h-8 flex-shrink-0 mt-1 ${
                  scanResult.riskLevel === 'Critical' ? 'text-red-600' : 
                  scanResult.riskLevel === 'High' ? 'text-orange-600' : 'text-yellow-600'
                }`} />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              )}
              
              <div>
                <h3 className={`font-bold text-lg mb-1 ${
                  scanResult.riskLevel === 'Critical' ? 'text-red-800 dark:text-red-400' : 
                  scanResult.riskLevel === 'High' ? 'text-orange-800 dark:text-orange-400' : 
                  scanResult.riskLevel === 'Medium' ? 'text-yellow-800 dark:text-yellow-400' :
                  'text-green-800 dark:text-green-400'
                }`}>
                  {t('detectedHazard') || "Hazard"}: {t(scanResult.hazardType) || scanResult.hazardType}
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider mb-0.5">{t('confidenceScore')}</span>
                    <span className="font-bold text-slate-800 dark:text-white text-base">{scanResult.confidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider mb-0.5">Risk Level</span>
                    <span className={`font-bold text-base ${
                      scanResult.riskLevel === 'Critical' ? 'text-red-600 dark:text-red-400' : 
                      scanResult.riskLevel === 'High' ? 'text-orange-600 dark:text-orange-400' : 
                      scanResult.riskLevel === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {t(scanResult.riskLevel?.toLowerCase()) || scanResult.riskLevel}
                    </span>
                  </div>
                  {scanResult.riskScore !== undefined && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase tracking-wider mb-0.5">Risk Score</span>
                      <span className="font-bold text-slate-800 dark:text-white text-base">{scanResult.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{t('aiRecommendation') || 'Recommended Action'}</h4>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {scanResult.recommendedAction || scanResult.suggestedAction}
              </div>
            </div>
            
            {(scanResult.aiExplanation || scanResult.description) && (
               <div className="mt-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">AI Analysis</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    "{scanResult.aiExplanation || scanResult.description}"
                  </div>
               </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => { setImage(null); setImageFile(null); setScanningStatus('idle'); }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition-all"
              >
                {t('cancel')}
              </button>
              {scanResult.riskLevel !== 'Low' && (
                <button 
                  onClick={handleSubmit}
                  className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                >
                  {t('submitAIReport')}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
