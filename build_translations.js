import fs from 'fs';

const keys = [
  "appName", "tagline", "initializing", "chooseLanguage", "selectLanguageSubtitle", "searchLanguage", "continue", "welcome", "login", "register", "mobileLogin", "emailLogin", "name", "mobileNumber", "emailAddress", "password", "selectRole", "passenger", "railwayStaff", "tracksideResident", "volunteer", "other", "continueAsGuest", "loginSubtitle", "dashboard", "home", "sos", "sosAlert", "report", "reportHazard", "aiHazardScanner", "railwaySafetyMap", "myReports", "crowdVerification", "safetyRewards", "notifications", "profile", "settings", "changeLanguage", "languageChanged", "railwaySafetyActive", "verifiedCommunity", "locationAccessEnabled", "sendEmergencyAlert", "openSOS", "reportSafetyIssues", "reportNow", "uploadDetectHazards", "scanImage", "viewNearbyAlerts", "openMap", "recentSafetyAlerts", "safetyPointsSummary", "crowdVerificationNeeded", "pressHoldSOS", "emergencyType", "trainNumber", "coachNumber", "seatNumber", "location", "description", "uploadPhoto", "addVoiceNote", "scanCoachQR", "fireSmoke", "medicalEmergency", "suspiciousActivity", "trackDamage", "accidentRisk", "womenSafety", "electricalHazard", "coachDamage", "gpsAutoDetected", "currentTime", "deviceId", "alertPriorityCritical", "sosSuccess", "locationShared", "controlRoomNotified", "stationMasterNotified", "rpfNotified", "tteNotified", "emergencyResponseInitiated", "sosSubmitted", "aiVerificationStarted", "authorityNotified", "responseTeamAssigned", "submitReport", "reportSuccess", "aiVerificationInProgress", "crowdConfirmationWaiting", "sentToPrahariSystem", "hazardCategory", "severityLevel", "low", "medium", "high", "critical", "autoDetectLocation", "manualLocation", "brokenSleeper", "signalVisibilityIssue", "fallenTree", "platformSafetyIssue", "animalIntrusion", "waterlogging", "suspiciousObject", "overcrowding", "aiScannerSubtitle", "uploadImage", "captureCamera", "analyzeImage", "scanningImage", "detectingHazard", "estimatingSeverity", "generatingReport", "detectedHazard", "confidenceScore", "severity", "aiRecommendation", "submitAIReport", "scanAnotherImage", "aiReportSubmitted", "mapSubtitle", "all", "nearby", "verified", "resolved", "submitted", "underAction", "aiVerification", "crowdVerified", "sentToCommandCenter", "duplicateRejected", "reportId", "category", "submittedTime", "status", "authorityAction", "reportsReceived", "confirmIssue", "notSeenFalseReport", "thanksForVerifying", "feedbackRecorded", "safetyPoints", "verifiedReports", "communityRank", "badges", "safetyWatcher", "railGuardian", "emergencyReporter", "communityProtector", "prahariChampion", "markAllRead", "emergencyContact", "enableLocationAccess", "enableSafetyNotifications", "offlineMode", "logout", "themeCustomization", "personalizeExperience", "appearanceMode", "lightMode", "darkMode", "systemDefault", "accentColor", "cardStyle", "glassmorphism", "solidMinimal", "softGradient", "backgroundStyle", "defaultNavy", "premiumGradient", "safetyLight", "emergencyDark", "fontSize", "small", "medium", "large", "reducedMotion", "resetTheme", "themeUpdated", "themeReset", "submit", "cancel", "save", "close", "emergencyContactAlert", "reportTrustScore", "nearbyStation", "duplicateReportDetected", "emergencyResponseTracking"
];

const langs = ["en", "hi", "ta", "te", "kn", "ml", "mr", "bn", "gu", "pa", "or", "as", "ur", "sa", "kok", "mni", "ne", "brx", "doi", "ks", "mai", "sat", "sd"];

let translations = {};

langs.forEach(lang => {
  translations[lang] = {};
  keys.forEach(key => {
    let val = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    // Create a mock translation string by appending the language code.
    // E.g. "Dashboard" -> "[ta] Dashboard"
    if (lang !== 'en') {
      val = '[' + lang.toUpperCase() + '] ' + val;
    }
    
    translations[lang][key] = val;
  });
});

const output = 'export const translations = ' + JSON.stringify(translations, null, 2) + ';';

fs.writeFileSync('src/data/translations.js', output);
console.log('Done');
