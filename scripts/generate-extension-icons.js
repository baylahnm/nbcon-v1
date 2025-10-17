/**
 * Generate icons for browser extension
 * Creates placeholder icons with NBCON branding
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../browser-extension/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon
function generateSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0066cc" rx="${size * 0.15}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">
    N
  </text>
  <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.1}" fill="#10b981"/>
</svg>`;
}

// Convert SVG to PNG (requires canvas or sharp library)
// For now, we'll create SVG files that can be manually converted
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svgContent = generateSVGIcon(size);
  const filePath = path.join(iconsDir, `icon${size}.svg`);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Generated icon${size}.svg`);
});

console.log('\n📝 Note: SVG files created. To create PNG files:');
console.log('1. Open SVG files in a browser or image editor');
console.log('2. Export as PNG at the correct sizes (16x16, 48x48, 128x128)');
console.log('3. Save as icon16.png, icon48.png, icon128.png');
console.log('4. Or use an online SVG to PNG converter\n');
console.log('Recommended: https://cloudconvert.com/svg-to-png\n');

// Create a placeholder .gitkeep to ensure directory exists
fs.writeFileSync(path.join(iconsDir, '.gitkeep'), '');

console.log('✨ Icon generation complete!');

