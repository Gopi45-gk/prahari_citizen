const fs = require('fs');
const path = require('path');
const https = require('https');

const enJson = require('./src/i18n/locales/en.json');

const languages = [
  { code: 'te', gt: 'te' },
  { code: 'kn', gt: 'kn' },
  { code: 'ml', gt: 'ml' },
  { code: 'bn', gt: 'bn' },
  { code: 'mr', gt: 'mr' },
  { code: 'gu', gt: 'gu' },
  { code: 'pa', gt: 'pa' },
  { code: 'or', gt: 'or' },
  { code: 'as', gt: 'as' },
  { code: 'ur', gt: 'ur' },
  { code: 'sa', gt: 'sa' },
  { code: 'kok', gt: 'gom' }, // Konkani
  { code: 'mni', gt: 'mni-Mtei' }, // Manipuri
  { code: 'ne', gt: 'ne' },
  { code: 'sd', gt: 'sd' },
  { code: 'doi', gt: 'doi' }, // Dogri
  { code: 'ks', gt: 'ks' }, // Kashmiri
  { code: 'brx', gt: 'en' }, // Bodo (fallback to EN since not widely supported in free GT)
  { code: 'sat', gt: 'en' }, // Santhali (fallback)
  { code: 'mai', gt: 'mai' } // Maithili
];

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  return new Promise((resolve) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0].map(x => x[0]).join(''));
        } catch(e) {
          resolve(text); // fallback
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function run() {
  const keys = Object.keys(enJson);
  const totalChunks = 5;
  const chunkSize = Math.ceil(keys.length / totalChunks);
  
  for (const lang of languages) {
    console.log(`Translating to ${lang.code}...`);
    const translatedJson = {};
    
    // Process in chunks to avoid URL length limits
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunkKeys = keys.slice(i, i + chunkSize);
      const chunkValues = chunkKeys.map(k => enJson[k]);
      
      // Join with a unique delimiter that translates reliably
      const textToTranslate = chunkValues.join(' ~~~ ');
      const translatedText = await translateText(textToTranslate, lang.gt);
      
      const translatedValues = translatedText.split(/\s*~~~\s*/);
      
      chunkKeys.forEach((key, idx) => {
        translatedJson[key] = translatedValues[idx] || enJson[key];
      });
    }
    
    fs.writeFileSync(
      path.join(__dirname, 'src', 'i18n', 'locales', `${lang.code}.json`), 
      JSON.stringify(translatedJson, null, 2)
    );
  }
  console.log("Done generating all static translations!");
}

run();
