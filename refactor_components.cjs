const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('useTranslation')) {
    return; // Already processed
  }

  // 1. Add import
  const importStatement = `import { useTranslation } from 'react-i18next';\n`;
  
  // Find the last import statement
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
  } else {
    content = importStatement + content;
  }

  // 2. Remove `t` from props and add hook
  // Pattern: export default function Something({ t, otherProps }) or ({ otherProps, t }) or ({ t })
  const regex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(\s*\{([^}]*)\}\s*\)\s*\{/g;
  
  content = content.replace(regex, (match, componentName, propsContent) => {
    // split props, remove 't'
    let props = propsContent.split(',').map(p => p.trim()).filter(p => p !== 't' && p !== '');
    let newPropsStr = props.length > 0 ? `{ ${props.join(', ')} }` : '';
    
    return `export default function ${componentName}(${newPropsStr}) {\n  const { t } = useTranslation();`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Refactored ${file}`);
});
