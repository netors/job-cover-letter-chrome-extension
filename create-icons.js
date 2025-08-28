// PNG Icon Generator for Chrome Extension
// Converts SVG icons to PNG using sharp library
// Run with: node create-icons.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create or load SVG content
const createSVGIcon = (size) => {
  // Check if SVG file already exists
  const svgPath = path.join(__dirname, 'icons', `icon${size}.svg`);
  
  if (fs.existsSync(svgPath)) {
    // Load existing SVG file
    console.log(`📄 Loading existing SVG: icon${size}.svg`);
    return fs.readFileSync(svgPath, 'utf8');
  }
  
  // Create new SVG if it doesn't exist
  console.log(`🎨 Creating new SVG: icon${size}.svg`);
  return `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" rx="3" fill="url(#gradient)"/>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="white" opacity="0.9"/>
  <polyline points="14 2 14 8 20 8" fill="white" opacity="0.9"/>
  <line x1="16" y1="13" x2="8" y2="13" stroke="#667eea" stroke-width="2"/>
  <line x1="16" y1="17" x2="8" y2="17" stroke="#667eea" stroke-width="2"/>
  <polyline points="10 9 9 9 8 9" stroke="#667eea" stroke-width="2"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>`;
};

// Convert SVG to PNG using sharp
const convertSVGToPNG = async (svgContent, outputPath, size) => {
  try {
    // Convert SVG string to Buffer
    const svgBuffer = Buffer.from(svgContent);
    
    // Use sharp to convert SVG to PNG
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    console.log(`✅ Created ${path.basename(outputPath)} (${size}x${size}, ${stats.size} bytes)`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${path.basename(outputPath)}:`, error.message);
    return false;
  }
};

// Main function
const generateIcons = async () => {
  console.log('🚀 Starting icon generation...\n');
  
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(__dirname, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
    console.log('📁 Created icons directory\n');
  }
  
  // Icon sizes required for Chrome Extension
  const sizes = [16, 32, 48, 128];
  let successCount = 0;
  
  // Process each icon size
  for (const size of sizes) {
    const svgContent = createSVGIcon(size);
    const outputPath = path.join(iconsDir, `icon${size}.png`);
    
    // Save SVG file if it doesn't exist
    const svgPath = path.join(iconsDir, `icon${size}.svg`);
    if (!fs.existsSync(svgPath)) {
      fs.writeFileSync(svgPath, svgContent);
      console.log(`💾 Saved SVG: icon${size}.svg`);
    }
    
    // Convert to PNG
    const success = await convertSVGToPNG(svgContent, outputPath, size);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(50));
  if (successCount === sizes.length) {
    console.log('🎉 All PNG icons created successfully!');
    console.log('📁 Icons saved to:', iconsDir);
    console.log('\n✨ Your Chrome Extension icons are ready for submission!');
  } else {
    console.log(`⚠️ Created ${successCount}/${sizes.length} icons`);
    console.log('Please check the errors above and try again.');
  }
};

// Run the generator
generateIcons().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});