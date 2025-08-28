# AI Cover Letter Generator Chrome Extension

🚀 **[Live Demo & Documentation](https://netors.github.io/job-cover-letter-chrome-extension/)** • 📖 **[Support & FAQ](https://netors.github.io/job-cover-letter-chrome-extension/support.html)**

A powerful Chrome extension that automatically generates personalized cover letters from job descriptions using cutting-edge AI technology from OpenAI and Anthropic.

> **Status**: Ready for Chrome Web Store publication • **Version**: 1.0.0 • **License**: MIT

## ✨ Features

### 🎯 Intelligent Job Detection
- **Universal Compatibility**: Works on 100+ job sites including LinkedIn, Indeed, Glassdoor, Monster, and company career pages
- **Smart Extraction**: Automatically detects and extracts job titles, companies, descriptions, requirements, and responsibilities
- **Real-time Detection**: Instant job recognition with visual loading states and progress feedback
- **Force Re-detect**: Manual re-detection for dynamic or complex job pages

### 🤖 Dual AI Provider Support
- **OpenAI Integration**: GPT-4o, GPT-4o-mini, and GPT-3.5-turbo models
- **Claude Integration**: Claude 3.5 Sonnet, Claude 3 Haiku, and other Anthropic models
- **Provider Selection**: Choose your preferred AI provider and model per generation
- **Redundancy**: Switch between providers for reliability and preference

### 🎨 Personalization & Quality
- **Multiple Tones**: Professional, Enthusiastic, Concise, and Friendly writing styles  
- **Resume Integration**: Upload and integrate your resume for personalized content
- **Dynamic Prompting**: Advanced prompt engineering for high-quality, relevant letters
- **Real Date Integration**: Proper date formatting (no more "[Date]" placeholders)

### 📱 Modern User Experience
- **Loading States**: Clear progress indicators during job detection and generation
- **Popup Interface**: Quick access to all features from any job page
- **Visual Feedback**: Status indicators, success messages, and error handling
- **Responsive Design**: Works seamlessly across different screen sizes

### 📚 Advanced History Management
- **Complete History**: All generated cover letters saved with full details
- **Clickable Job Links**: Direct links back to original job postings
- **AI Provider Tracking**: Visual indicators showing which AI generated each letter (🧠 OpenAI, 🤖 Claude)
- **Pin System**: Pin frequently used letters to the top of your history
- **Smart Organization**: Auto-highlighting of letters for the same job URL

### 📄 Professional PDF Export
- **PDF Generation**: Download cover letters as professional PDF documents
- **Print Optimization**: Properly formatted for business letter standards
- **Contact Integration**: Automatic inclusion of your professional contact information
- **Easy Access**: One-click PDF generation with browser print dialog

### 🔒 Security & Privacy
- **Secure Storage**: API keys stored safely in Chrome's encrypted storage
- **Local Processing**: Your data never leaves your browser except for AI API calls
- **Privacy First**: No tracking, no data collection, no third-party sharing
- **Open Source**: Full transparency with open-source codebase

## 📦 Installation

### Method 1: Chrome Web Store (Recommended)
🏪 **[Install from Chrome Web Store](https://chrome.google.com/webstore/category/extensions)** (Coming Soon)

### Method 2: Developer Mode (Available Now)

1. **Download the Extension**
   ```bash
   git clone https://github.com/netors/job-cover-letter-chrome-extension.git
   cd job-cover-letter-chrome-extension
   ```

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" on (top right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the extensions puzzle icon in Chrome toolbar
   - Pin the AI Cover Letter Generator for easy access

## 🚀 Setup & Configuration

### 1. Get AI Provider API Keys

#### Option A: OpenAI (Recommended for beginners)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Create a new API key
4. Copy the key (starts with `sk-`)

#### Option B: Anthropic Claude (Advanced)
1. Visit [Anthropic Console](https://console.anthropic.com/keys)
2. Sign in to your Anthropic account
3. Create a new API key
4. Copy the key (starts with `sk-ant-`)

#### Option C: Both Providers (Best Experience)
- Set up both APIs for maximum flexibility and redundancy
- Switch between providers based on your needs and preferences

### 2. Configure the Extension
1. Click the extension icon and click the ⚙️ settings button
2. **API Configuration Tab:**
   - **OpenAI Setup**: Paste your OpenAI API key and test connection
   - **Claude Setup**: Paste your Anthropic API key and test connection
   - **Default Provider**: Choose your preferred default provider
   - **Model Selection**: Pick your preferred models for each provider

3. **Personal Information Tab:**
   - Enter your name, email, phone number
   - Add your LinkedIn profile URL
   - Include your location/address
   - This information appears in your cover letter headers

4. **Resume Tab:**
   - **File Upload**: Upload your resume (TXT, PDF, DOC, DOCX supported)
   - **Direct Entry**: Or paste your resume content directly
   - **Tips**: Include specific achievements, quantifiable results, and relevant skills

5. **Preferences Tab:**
   - **Writing Tone**: Professional, Enthusiastic, Concise, or Friendly
   - **Cover Letter Length**: Short, Medium, or Detailed
   - **Custom Instructions**: Add specific guidance for AI generation
   - **Default Settings**: Set your preferred provider and model

## 📖 Usage

### Quick Start Guide

1. **Navigate to a Job Listing**
   - Visit any job site (LinkedIn, Indeed, Glassdoor, etc.)
   - Click the extension icon in your Chrome toolbar
   - The extension will show "Detecting job description..." with a loading indicator

2. **AI Provider Selection** (New!)
   - Once a job is detected, you'll see provider options in the popup
   - **AI Provider**: Choose between OpenAI or Claude
   - **Model**: Select your preferred model (GPT-4o-mini or Claude-3.5-sonnet recommended)
   - Settings are remembered for future generations

3. **Generate Your Cover Letter**
   - Click "Generate Cover Letter" button
   - Watch the progress as AI creates your personalized letter
   - Generation typically takes 10-30 seconds

4. **Review and Export**
   - **Edit**: Click in the letter content to make changes
   - **Copy**: Copy to clipboard for pasting into applications
   - **Download**: Generate a professional PDF for attachments
   - **Regenerate**: Try different providers or settings for alternative versions

### Advanced Features

#### History Management
- **View All Letters**: Access complete history of generated cover letters
- **Quick Links**: Click job site domains to return to original job postings  
- **AI Provider Badges**: See which AI (🧠 OpenAI or 🤖 Claude) created each letter
- **Pin Important Letters**: Pin frequently used letters to the top
- **Same Job Highlighting**: Letters for the same job URL are visually highlighted

#### Provider Flexibility
- **Popup Override**: Change provider/model without going to settings
- **A/B Testing**: Generate the same letter with different AI providers to compare
- **Fallback Options**: If one API is down, switch to the other instantly

#### Force Re-detection
- **Manual Re-scan**: Use "🔄 Force Re-detect" if automatic detection fails
- **Complex Pages**: Helpful for JavaScript-heavy or unusual job page layouts

## Supported Job Sites

The extension works on many job sites including:

- **Major Job Boards:** LinkedIn Jobs, Indeed, Glassdoor, Monster, ZipRecruiter
- **Tech Platforms:** AngelList/Wellfound, Dice, Stack Overflow Jobs
- **Company Sites:** Any career page with structured job data
- **ATS Systems:** Workday, Greenhouse, Lever, BambooHR

## Privacy & Security

### Data Handling
- **API Keys:** Stored securely in Chrome's sync storage
- **Personal Info:** Kept locally, never shared except with OpenAI for generation
- **Job Data:** Processed temporarily, not permanently stored
- **Generated Letters:** Stored locally for your convenience

### AI Provider Integration
- Job descriptions and resume data are sent to your chosen AI provider (OpenAI/Anthropic)
- Provider data usage policies apply (see [Privacy Policy](https://netors.github.io/job-cover-letter-chrome-extension/privacy.html))
- You use your own API keys and pay your own usage costs
- Consider using generic resume summaries for sensitive positions

## Troubleshooting

### Common Issues

**Extension not detecting jobs:**
- Refresh the page after navigating to a job listing
- Check if the page contains job description keywords
- Try different job sites

**API errors:**
- Verify your API key is valid (OpenAI or Anthropic)
- Check your account has sufficient credits/balance
- Test the connection in settings
- Try switching to the other AI provider

**Poor cover letter quality:**
- Upload a detailed resume with specific achievements
- Add custom instructions in preferences
- Try different models (GPT-4o for best quality)

### Debug Information
Access debug info by:
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for extension log messages
4. Check for any error messages

## 💰 Cost Estimation

### OpenAI Pricing (approximate per cover letter):
- **GPT-4o-mini**: $0.01-0.03 per letter (⭐ recommended balance)
- **GPT-4o**: $0.05-0.15 per letter (highest quality)
- **GPT-3.5-turbo**: $0.005-0.02 per letter (budget option)

### Claude Pricing (approximate per cover letter):
- **Claude 3.5 Sonnet**: $0.03-0.08 per letter (⭐ recommended quality)
- **Claude 3 Haiku**: $0.01-0.03 per letter (fast and affordable)

### Cost Factors:
- Length of job description and requirements
- Size and detail of your resume
- Chosen AI model and provider
- Cover letter length preference
- Custom instructions and complexity

### Money-Saving Tips:
- Use GPT-4o-mini or Claude 3 Haiku for most applications
- Reserve premium models (GPT-4o, Claude 3.5 Sonnet) for priority applications
- Keep resumes concise but detailed
- Use shorter cover letter preferences for basic applications

## Advanced Features

### Custom Prompts
Modify generation behavior in Preferences:
- Emphasize specific skills or experience
- Target certain industries or roles
- Adjust for different career levels

### Bulk Operations
- Save multiple versions of cover letters
- Export entire history for record keeping
- Compare different approaches for the same job

### Integration Tips
- Use with job tracking spreadsheets
- Combine with application management tools
- Save different resume versions for different industries

## Development

### Building from Source
```bash
# Clone repository
git clone https://github.com/netors/job-cover-letter-chrome-extension.git
cd job-cover-letter-chrome-extension

# Install dependencies (if any)
npm install

# Create icons
node create-icons.js

# Load in Chrome developer mode
# Follow installation Method 2 above
```

### File Structure
```
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── options.html           # Settings page
├── js/
│   ├── background.js      # Background service worker
│   ├── content-script.js  # Page interaction logic
│   ├── popup.js          # Popup functionality
│   ├── options.js        # Settings page logic
│   └── utils.js          # Shared utilities
├── css/
│   ├── popup.css         # Popup styles
│   ├── options.css       # Settings page styles
│   └── content.css       # Injected page styles
├── icons/                # Extension icons
└── README.md            # This file
```

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Areas for Contribution
- Additional job site support
- Improved job description parsing
- UI/UX enhancements
- Multi-language support
- Additional export formats

## 💬 Support & Community

### Getting Help
- 📚 **[Complete FAQ & Setup Guide](https://netors.github.io/job-cover-letter-chrome-extension/support.html)**
- 🐛 **[Report Issues](https://github.com/netors/job-cover-letter-chrome-extension/issues)** - Bug reports and technical problems
- 💡 **[Feature Requests](https://github.com/netors/job-cover-letter-chrome-extension/issues)** - Ideas for improvements
- 🔒 **[Privacy Policy](https://netors.github.io/job-cover-letter-chrome-extension/privacy.html)** - How your data is handled
- 📜 **[Terms of Service](https://netors.github.io/job-cover-letter-chrome-extension/terms.html)** - Usage terms and responsibilities

### Before Reporting Issues
- Check the [FAQ page](https://netors.github.io/job-cover-letter-chrome-extension/support.html) for common solutions
- Search [existing issues](https://github.com/netors/job-cover-letter-chrome-extension/issues) 
- Include browser console errors and screenshots when reporting bugs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📋 Changelog

### v1.0.0 (Current - August 2025) - Chrome Web Store Ready
- ✅ **Dual AI Provider Support**: Added Anthropic Claude integration alongside OpenAI
- ✅ **Enhanced History Management**: Clickable job links, AI provider badges, and pin functionality  
- ✅ **Professional PDF Export**: Proper PDF generation with print-optimized formatting
- ✅ **Improved User Experience**: Loading states, better error handling, and visual feedback
- ✅ **Provider Selection UI**: Choose AI provider and model directly in popup
- ✅ **Real Date Integration**: Eliminated placeholder dates in generated letters
- ✅ **Advanced Job Detection**: Force re-detect functionality and better error recovery
- ✅ **Chrome Web Store Ready**: Professional icons, screenshots, and documentation
- ✅ **Complete Documentation**: GitHub Pages site with support, privacy policy, and terms
- ✅ **Storage System**: Reliable local storage with sync capabilities
- ✅ **Multi-site Support**: Works on LinkedIn, Indeed, Glassdoor, and 100+ job sites

### Development History
- ✅ **Dec 2024**: Storage system overhaul for reliability
- ✅ **Dec 2024**: Claude API integration with proper message formatting  
- ✅ **Dec 2024**: History enhancements with URL tracking
- ✅ **Dec 2024**: PDF download fixes for service worker compatibility
- ✅ **Dec 2024**: UI/UX improvements and date handling
- ✅ **Dec 2024**: Enhanced job detection with retry mechanisms
- ✅ **Dec 2024**: Core functionality and OpenAI integration

### 🚀 Planned Features (v1.1.0+)
- **Template System**: Custom cover letter templates and formats
- **Enhanced AI Features**: Multi-language support and industry specialization
- **Integration Improvements**: ATS integration and CRM connectivity
- **Analytics**: Success tracking and application outcome monitoring
- **Collaboration**: Team workspaces and mentor review workflows
- **Mobile Support**: Companion mobile app for on-the-go applications

---

**Made with ❤️ for job seekers everywhere**
