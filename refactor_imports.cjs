const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/import\s*\{\s*useTranslation\s*\}\s*from\s*['"]react-i18next['"];?/g, "import { useTranslation } from '../i18n/useTranslation';");
  fs.writeFileSync(filePath, content, 'utf-8');
});

const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf-8');
appContent = appContent.replace(/import\s*\{\s*useTranslation\s*\}\s*from\s*['"]react-i18next['"];?/g, "import { useTranslation } from './i18n/useTranslation';");
fs.writeFileSync(appPath, appContent, 'utf-8');

console.log("Global import replacements completed.");
