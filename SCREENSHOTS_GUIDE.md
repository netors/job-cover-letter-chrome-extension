# Chrome Web Store Screenshots Guide

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

```bash
# Using sharp (already installed)
node -e "require('sharp')('input.png').resize(1280, 800).png({compressionLevel: 9}).toFile('output.png')"

# Using ImageMagick (if installed)
convert input.png -resize 1280x800! -strip -quality 95 output.png

# Using online tools
# - TinyPNG.com
# - Squoosh.app
# - ImageOptim (Mac)
```

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
