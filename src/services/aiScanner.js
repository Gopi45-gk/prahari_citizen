const MOCK_DELAY_MS = 2500;

const mockScanResult = {
  hazardType: "Track Damage",
  riskLevel: "High",
  confidence: "89%",
  description: "Visible structural crack on the track sleeper with potential alignment issues.",
  suggestedAction: "Alert railway control room immediately and restrict trackside movement until inspection. Potential risk of derailment if left unaddressed.",
  alertRecommended: true
};

export async function scanHazardWithAI(base64Image) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.warn("No VITE_GEMINI_API_KEY found, falling back to mock AI scan.");
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockScanResult), MOCK_DELAY_MS);
    });
  }

  try {
    // Strip the data:image/jpeg;base64, prefix if present
    let base64Data = base64Image;
    let mimeType = "image/jpeg";
    
    if (base64Image.startsWith("data:")) {
      const parts = base64Image.split(";base64,");
      mimeType = parts[0].split(":")[1];
      base64Data = parts[1];
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image for railway or public safety hazards. Respond ONLY with a valid JSON object matching exactly this schema: { \"hazardType\": string, \"riskLevel\": \"Low\" | \"Medium\" | \"High\" | \"Critical\", \"confidence\": string (e.g. \"92%\"), \"description\": string, \"suggestedAction\": string, \"alertRecommended\": boolean }. If no hazard is found, return { \"hazardType\": \"No Hazard Detected\", \"riskLevel\": \"Low\", \"confidence\": \"100%\", \"description\": \"The area appears to be safe and clear of hazards.\", \"suggestedAction\": \"No action required.\", \"alertRecommended\": false }."
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Invalid response structure from Gemini API");
    }

    // Clean up potential markdown formatting around JSON
    const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
    
  } catch (error) {
    console.error("AI Scan Failed, falling back to mock:", error);
    // Fallback to mock if API fails (e.g., quota exceeded, bad key)
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockScanResult), 1000);
    });
  }
}
