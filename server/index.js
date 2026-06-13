import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/api/translate-ui', async (req, res) => {
  const { enJson, targetLang } = req.body;

  if (!enJson || !targetLang) {
    return res.status(400).json({ error: 'Missing enJson or targetLang' });
  }

  const apiKey = process.env.TRANSLATION_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Translation API key missing on server' });
  }

  const prompt = `Translate the following JSON values into the ${targetLang} language. 
Return ONLY valid JSON.
Do not add explanations.
Do not change JSON keys.
Keep railway safety terms meaningful. Keep PRAHARI as PRAHARI.
Keep numbers, report IDs, train numbers, coordinates, and technical values unchanged.
For Indian languages, use correct native script Unicode. For Urdu, use proper Urdu script.

Source JSON:
${JSON.stringify(enJson, null, 2)}`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Safety parse just in case
    const translatedJson = JSON.parse(content);
    res.json(translatedJson);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to generate translations' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
