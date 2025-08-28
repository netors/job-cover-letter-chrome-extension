// Screenshot Generator for Chrome Web Store
// Creates placeholder screenshots with instructions
// Run with: node create-screenshots.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Screenshot specifications
const screenshots = [
  {
    name: 'screenshot1-popup-job-detected.png',
    title: 'Job Detection in Action',
    description: [
      '1. Navigate to LinkedIn Jobs or Indeed',
      '2. Open any job listing',
      '3. Click the extension icon',
      '4. Show the popup with:',
      '   - Job title and company detected',
      '   - AI provider selection (OpenAI/Claude)',
      '   - Model selection dropdown',
      '   - "Generate Cover Letter" button',
      '   - Loading state indicator'
    ],
    color: '#667eea'
  },
  {
    name: 'screenshot2-generated-letter.png',
    title: 'AI-Generated Cover Letter',
    description: [
      '1. Show the popup after generation',
      '2. Display the generated cover letter',
      '3. Visible elements:',
      '   - Complete cover letter text',
      '   - Copy button',
      '   - Download PDF button',
      '   - Regenerate button',
      '   - Provider badge (🧠 or 🤖)'
    ],
    color: '#764ba2'
  },
  {
    name: 'screenshot3-settings-page.png',
    title: 'Easy Configuration',
    description: [
      '1. Open the extension settings page',
      '2. Show the API Configuration tab',
      '3. Display:',
      '   - OpenAI API key field',
      '   - Claude API key field',
      '   - Test connection buttons',
      '   - Model selection options',
      '   - Success indicators'
    ],
    color: '#f093fb'
  },
  {
    name: 'screenshot4-history-management.png',
    title: 'Cover Letter History',
    description: [
      '1. Show the History tab in popup',
      '2. Display multiple saved letters',
      '3. Highlight features:',
      '   - Pinned letters at top',
      '   - Job site links (clickable)',
      '   - AI provider badges',
      '   - Date/time stamps',
      '   - Quick actions (view/copy)'
    ],
    color: '#4facfe'
  },
  {
    name: 'screenshot5-multi-site-support.png',
    title: 'Works Everywhere',
    description: [
      '1. Create a collage showing:',
      '   - LinkedIn Jobs',
      '   - Indeed',
      '   - Glassdoor',
      '   - Company career pages',
      '2. Show the extension working on each',
      '3. Demonstrate universal compatibility'
    ],
    color: '#00f2fe'
  }
];

// Create placeholder screenshot with instructions
const createPlaceholder = async (screenshot, width = 1280, height = 800) => {
  try {
    // Create SVG with instructions
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${screenshot.color};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${screenshot.color};stop-opacity:0.2" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="white"/>
      
      <!-- Border -->
      <rect x="1" y="1" width="${width-2}" height="${height-2}" fill="none" stroke="${screenshot.color}" stroke-width="2" stroke-dasharray="10,5" opacity="0.3"/>
      
      <!-- Title -->
      <text x="${width/2}" y="80" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="${screenshot.color}">
        ${screenshot.title}
      </text>
      
      <!-- Screenshot filename -->
      <text x="${width/2}" y="120" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">
        ${screenshot.name}
      </text>
      
      <!-- Instructions -->
      ${screenshot.description.map((line, i) => `
        <text x="100" y="${200 + i * 35}" font-family="Arial, sans-serif" font-size="20" fill="#333">
          ${line}
        </text>
      `).join('')}
      
      <!-- Dimensions -->
      <text x="${width/2}" y="${height - 40}" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#999">
        ${width}x${height} pixels • 24-bit PNG (no alpha) • Chrome Web Store Ready
      </text>
    </svg>`;

    // Convert to PNG
    const outputPath = path.join(__dirname, 'screenshots', screenshot.name);
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✅ Created ${screenshot.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${screenshot.name}:`, error.message);
    return false;
  }
};

// Main function
const generateScreenshots = async () => {
  console.log('📸 Chrome Web Store Screenshot Generator\n');
  console.log('=' .repeat(50));
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
    console.log('📁 Created screenshots directory\n');
  }
  
  // Generate placeholders
  console.log('Creating placeholder screenshots with instructions:\n');
  
  for (const screenshot of screenshots) {
    await createPlaceholder(screenshot);
  }
  
  // Also create 640x400 versions
  console.log('\nCreating 640x400 versions:\n');
  
  for (const screenshot of screenshots) {
    const smallName = { ...screenshot, name: screenshot.name.replace('.png', '-640x400.png') };
    await createPlaceholder(smallName, 640, 400);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📌 NEXT STEPS:\n');
  console.log('1. Install the extension in Chrome');
  console.log('2. Navigate to the pages described in each placeholder');
  console.log('3. Take actual screenshots using:');
  console.log('   - Mac: Cmd+Shift+4 (select area)');
  console.log('   - Windows: Win+Shift+S (snip tool)');
  console.log('   - Chrome DevTools: Cmd+Shift+P → "Capture screenshot"');
  console.log('\n4. Replace the placeholder images with real screenshots');
  console.log('5. Ensure screenshots are 1280x800 or 640x400 exactly');
  console.log('6. Save as PNG without transparency (24-bit)');
  console.log('\n📁 Screenshots saved to:', screenshotsDir);
};

// Create instructions markdown
const createInstructions = () => {
  const content = `# Chrome Web Store Screenshots Guide

## Requirements
- **Dimensions**: 1280x800 or 640x400 pixels (exactly)
- **Format**: JPEG or 24-bit PNG (no alpha/transparency)
- **Quantity**: Minimum 1, maximum 5 screenshots
- **File size**: Keep under 1MB per screenshot

## Recommended Screenshots

### Screenshot 1: Job Detection (REQUIRED)
**Filename**: screenshot1-popup-job-detected.png
- Show the extension popup on a LinkedIn job page
- Display detected job title and company
- Show AI provider selection (OpenAI/Claude)
- Include the "Generate Cover Letter" button

### Screenshot 2: Generated Cover Letter
**Filename**: screenshot2-generated-letter.png
- Display a complete generated cover letter
- Show copy and download buttons
- Include the AI provider badge
- Make sure text is readable

### Screenshot 3: Settings Page
**Filename**: screenshot3-settings-page.png
- Show the API configuration tab
- Display both OpenAI and Claude setup
- Include test connection success indicators
- Show personal information fields

### Screenshot 4: History Management
**Filename**: screenshot4-history-management.png
- Display the history tab with multiple letters
- Show pinned items at top
- Include job site links and AI badges
- Demonstrate the organization features

### Screenshot 5: Multi-Site Support
**Filename**: screenshot5-multi-site-support.png
- Create a collage or split view
- Show extension working on LinkedIn, Indeed, Glassdoor
- Demonstrate universal compatibility

## How to Take Screenshots

### Method 1: Chrome DevTools (Recommended)
1. Open Chrome DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Capture screenshot"
4. Choose "Capture area screenshot"
5. Select the exact area (1280x800)

### Method 2: macOS Screenshot
1. Press Cmd+Shift+4
2. Select area while holding Space to move
3. Use Preview to resize to exact dimensions

### Method 3: Windows Snipping Tool
1. Press Win+Shift+S
2. Select rectangular snip
3. Use Paint or Photos to resize

## Screenshot Tips

### DO:
✅ Use a clean browser profile
✅ Clear unnecessary tabs and bookmarks
✅ Use realistic job data
✅ Show actual generated content
✅ Highlight key features with cursor/focus
✅ Use high contrast for readability
✅ Include success states and confirmations

### DON'T:
❌ Include personal information
❌ Show API keys or secrets
❌ Use lorem ipsum text
❌ Include browser developer tools
❌ Show error states (unless demonstrating error handling)
❌ Use transparency or alpha channels
❌ Exceed 1MB file size

## Image Optimization

After taking screenshots, optimize them:

\`\`\`bash
# Using sharp (already installed)
node -e "require('sharp')('input.png').resize(1280, 800).png({compressionLevel: 9}).toFile('output.png')"

# Using ImageMagick (if installed)
convert input.png -resize 1280x800! -strip -quality 95 output.png

# Using online tools
# - TinyPNG.com
# - Squoosh.app
# - ImageOptim (Mac)
\`\`\`

## Final Checklist

Before uploading to Chrome Web Store:

- [ ] All screenshots are exactly 1280x800 or 640x400
- [ ] PNG files have no transparency (24-bit RGB)
- [ ] Each file is under 1MB
- [ ] Screenshots show actual functionality
- [ ] No personal data or API keys visible
- [ ] UI elements are clearly visible
- [ ] Text is readable at display size
- [ ] Features are highlighted appropriately
- [ ] At least one screenshot is provided
- [ ] Screenshots match store description

## Upload Order

1. **Hero Screenshot**: Job detection with clear UI
2. **Value Screenshot**: Generated cover letter
3. **Feature Screenshot**: Settings and configuration
4. **Benefit Screenshot**: History management
5. **Compatibility Screenshot**: Multi-site support

Remember: The first screenshot is most important as it appears in search results!
`;

  fs.writeFileSync(path.join(__dirname, 'SCREENSHOTS_GUIDE.md'), content);
  console.log('📝 Created SCREENSHOTS_GUIDE.md');
};

// Run the generator
generateScreenshots()
  .then(() => {
    createInstructions();
    console.log('\n✨ Screenshot templates ready!');
    console.log('📚 See SCREENSHOTS_GUIDE.md for detailed instructions');
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });