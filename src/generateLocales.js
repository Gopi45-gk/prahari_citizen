import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translations } from './data/translations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'i18n', 'locales');

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

for (const [lang, strings] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(strings, null, 2), 'utf-8');
  console.log(`Generated ${lang}.json`);
}

console.log("All locale files generated successfully.");
