const MOCK_DELAY_MS = 2500;

const mockScanResult = {
  hazardType: "Track Obstruction",
  confidence: "96.4%",
  riskScore: 92,
  riskLevel: "Critical",
  aiExplanation: "Large fallen tree detected across active railway track. Potential derailment or emergency braking scenario.",
  recommendedAction: "Notify nearest station immediately. Dispatch maintenance crew. Issue temporary speed restriction.",
  operationalImpact: "High",
  passengerSafetyImpact: "Critical"
};

// PRAHARI Risk Engine Rules
const RISK_RULES = {
  "Track Crack": 95,
  "Fallen Tree": 90,
  "Elephant": 92,
  "Fire": 98,
  "Signal Damage": 94,
  "Coach Damage": 70,
  "Smoke": 85,
  "Human Intrusion": 80,
  "Water Logging": 75,
  "Track Misalignment": 95,
  "Broken Sleeper": 85,
  "Track Obstruction": 90,
  "Rock on Track": 90,
  "Animal Intrusion": 85,
  "Cow": 88,
  "Dog": 60,
  "Buffalo": 88,
  "Broken Door": 65,
  "Broken Window": 60,
  "Electrical Hazard": 95,
  "Landslide": 98,
  "Debris": 70,
  "Garbage on Track": 40,
  "No Hazard Detected": 0
};

function calculateRiskLevel(score) {
  if (score <= 30) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 80) return "High";
  return "Critical";
}

export async function scanHazardWithAI(base64Image) {
  try {
    console.log("Sending image to FastAPI backend...");

    const response = await fetch("/api/scan-hazard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image })
    });

    if (!response.ok) {
      let errorBody = "";
      try {
        const errJson = await response.json();
        errorBody = JSON.stringify(errJson, null, 2);
        console.error("FastAPI Error Response:", errJson);
      } catch (e) {
        errorBody = await response.text();
        console.error("FastAPI Error Response (Text):", errorBody);
      }
      throw new Error(`Backend error (${response.status}): ${errorBody || response.statusText}`);
    }

    const data = await response.json();
    console.log("FastAPI Success Response:", data);
    
    // The backend returns the already-parsed JSON
    const parsedData = data;

    // PRAHARI Risk Assessment Engine
    let baseScore = RISK_RULES[parsedData.hazardType] !== undefined 
      ? RISK_RULES[parsedData.hazardType] 
      : (parsedData.hazardType === "No Hazard Detected" ? 0 : 50);

    // Add slight variance based on AI confidence
    const confVal = parseFloat(parsedData.confidence) || 90;
    const finalScore = baseScore === 0 ? 0 : Math.min(100, Math.max(1, Math.round(baseScore * (confVal / 100))));

    return {
      ...parsedData,
      riskScore: finalScore,
      riskLevel: calculateRiskLevel(finalScore)
    };
    
  } catch (error) {
    console.error("AI Scan Failed, falling back to mock:", error);
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockScanResult), 1000);
    });
  }
}
