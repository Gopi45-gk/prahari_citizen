export const demoUser = {
  name: "Citizen Guardian",
  role: "Passenger",
  mobile: "9876543210",
  email: "citizen@prahari.app",
  safetyPoints: 420,
  verifiedReports: 8,
  communityRank: 14
};

export const demoAlerts = [
  { id: 1, titleKey: "trackObstructionAlert", severity: "High", statusKey: "underVerification" },
  { id: 2, titleKey: "fallenTreeAlert", severity: "Medium", statusKey: "authorityNotifiedStatus" },
  { id: 3, titleKey: "coachDamageAlert", severity: "Medium", statusKey: "underAction" },
  { id: 4, titleKey: "platformCrowdAlert", severity: "Low", statusKey: "monitoring" }
];

export const demoReports = [
  { id: "PRH-2041", categoryKey: "coachDamage", statusKey: "underAction", aiConfidence: "82%" },
  { id: "PRH-2042", categoryKey: "trackDamage", statusKey: "crowdVerified", aiConfidence: "91%" },
  { id: "PRH-2043", categoryKey: "signalVisibilityIssue", statusKey: "resolved", aiConfidence: "76%" }
];

export const demoNotifications = [
  { id: 1, messageKey: "reportVerifiedMessage", read: false },
  { id: 2, messageKey: "rpfReceivedSosMessage", read: false },
  { id: 3, messageKey: "trackIssueInspectionMessage", read: true },
  { id: 4, messageKey: "safetyAdvisoryMessage", read: true },
  { id: 5, messageKey: "reportResolvedMessage", read: true }
];
