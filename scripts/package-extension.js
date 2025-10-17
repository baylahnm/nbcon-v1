/**
 * Package browser extension for distribution
 * Creates a ZIP file ready for Chrome Web Store
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionDir = path.join(__dirname, '../browser-extension');
const distDir = path.join(__dirname, '../dist');
const outputFile = path.join(distDir, `nbcon-cursor-devtools-${Date.now()}.zip`);

console.log('📦 Packaging NBCON Cursor Dev Tools Extension...\n');

// Check if extension directory exists
if (!fs.existsSync(extensionDir)) {
  console.error('❌ Error: browser-extension directory not found');
  process.exit(1);
}

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Check required files
const requiredFiles = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'devtools.html',
  'devtools.js',
  'devtools-panel.html',
  'devtools-panel.js',
  'styles.css'
];

console.log('🔍 Checking required files...');
let allFilesPresent = true;

requiredFiles.forEach(file => {
  const filePath = path.join(extensionDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesPresent = false;
  }
});

if (!allFilesPresent) {
  console.error('\n❌ Error: Some required files are missing');
  process.exit(1);
}

// Check for icons
console.log('\n🔍 Checking icons...');
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
let hasIcons = true;

iconFiles.forEach(file => {
  const filePath = path.join(extensionDir, 'icons', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ⚠️  ${file} - MISSING (extension will not work without icons)`);
    hasIcons = false;
  }
});

if (!hasIcons) {
  console.log('\n⚠️  Warning: Icons are missing. Run: npm run ext:icons');
  console.log('Then convert SVG files to PNG before packaging.\n');
}

// Create ZIP file (using native commands)
console.log('\n📦 Creating ZIP file...');

try {
  // Change to extension directory
  process.chdir(extensionDir);
  
  // Create ZIP using system command
  if (process.platform === 'win32') {
    // Windows: Use PowerShell Compress-Archive
    const powershellCmd = `Compress-Archive -Path * -DestinationPath "${outputFile}" -Force`;
    execSync(`powershell -Command "${powershellCmd}"`, { stdio: 'inherit' });
  } else {
    // Unix/Mac: Use zip command
    execSync(`zip -r "${outputFile}" . -x "*.git*" "node_modules/*" "*.DS_Store"`, { stdio: 'inherit' });
  }
  
  console.log('\n✅ Extension packaged successfully!');
  console.log(`📁 Output: ${outputFile}`);
  console.log(`📊 Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
  
  console.log('\n📋 Next steps:');
  console.log('1. Test the extension by loading the unpacked version');
  console.log('2. Upload to Chrome Web Store Developer Dashboard');
  console.log('3. Fill in store listing details');
  console.log('4. Submit for review\n');
  
} catch (error) {
  console.error('\n❌ Error creating ZIP file:', error.message);
  console.log('\nManual packaging:');
  console.log('1. Navigate to browser-extension folder');
  console.log('2. Select all files');
  console.log('3. Right-click → Send to → Compressed (zipped) folder');
  console.log('4. Rename to nbcon-cursor-devtools.zip\n');
  process.exit(1);
}

