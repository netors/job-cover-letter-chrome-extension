# Contributing to AI Cover Letter Generator

Thank you for your interest in contributing to the AI Cover Letter Generator! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### 1. Code Contributions
- **Bug Fixes**: Help us squash bugs and improve stability
- **New Features**: Add functionality that benefits the community
- **Performance Improvements**: Optimize existing code for better performance
- **Documentation**: Improve code comments, README, or technical docs

### 2. Non-Code Contributions
- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Documentation**: Help improve user guides and technical documentation
- **Testing**: Test new features and provide feedback
- **Community Support**: Help other users in discussions and issues

### 3. Translation & Localization
- **UI Translation**: Help translate the interface to other languages
- **Documentation Translation**: Translate documentation and guides
- **Localization**: Adapt features for different regions and cultures

## 🚀 Getting Started

### Prerequisites
- **Chrome Browser**: For testing the extension
- **Basic Web Development**: HTML, CSS, JavaScript knowledge
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Development Setup

1. **Fork the Repository**
   ```bash
   # Visit https://github.com/netors/job-cover-letter-chrome-extension
   # Click "Fork" button in the top right
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/netors/job-cover-letter-chrome-extension.git
   cd job-cover-letter-chrome-extension
   ```

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the project folder
   - The extension should appear in your extensions list

4. **Make Changes and Test**
   - Edit files in your preferred editor
   - Refresh the extension in Chrome to see changes
   - Test thoroughly on job sites like LinkedIn, Indeed, etc.

## 📋 Development Guidelines

### Code Style

#### JavaScript
- **ES6+**: Use modern JavaScript features
- **Async/Await**: Prefer over Promises chains
- **Error Handling**: Always include try-catch blocks
- **Comments**: Comment complex logic and API interactions

```javascript
// Good example
async function generateCoverLetter(jobData, settings) {
  try {
    console.log('🚀 Generating cover letter...');
    const result = await aiService.generate(jobData, settings);
    return result;
  } catch (error) {
    console.error('❌ Generation failed:', error);
    throw error;
  }
}
```

#### CSS
- **Consistent Naming**: Use kebab-case for CSS classes
- **Mobile First**: Design for mobile, enhance for desktop
- **CSS Variables**: Use for colors and spacing
- **Comments**: Document complex selectors and layouts

#### HTML
- **Semantic HTML**: Use appropriate HTML5 elements
- **Accessibility**: Include proper ARIA labels and roles
- **Responsive**: Design for all screen sizes

### Chrome Extension Best Practices

#### Manifest V3 Compliance
- **Service Workers**: Use background service workers, not background pages
- **Permissions**: Request minimal necessary permissions
- **Content Security Policy**: Follow strict CSP guidelines

#### Security
- **No Hardcoded Secrets**: Never commit API keys or tokens
- **Input Validation**: Sanitize all user inputs
- **Secure Storage**: Use Chrome storage APIs properly

### Git Workflow

#### Branch Naming
- **Features**: `feature/description` (e.g., `feature/claude-integration`)
- **Bug Fixes**: `fix/description` (e.g., `fix/job-detection-linkedin`)
- **Documentation**: `docs/description` (e.g., `docs/update-readme`)

#### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(popup): add Claude model selection
fix(detection): resolve LinkedIn job parsing issue
docs(readme): update installation instructions
refactor(storage): improve data persistence logic
```

#### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

3. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch and provide detailed description

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Extension loads without errors in Chrome
- [ ] Job detection works on LinkedIn, Indeed, Glassdoor
- [ ] Cover letter generation works with OpenAI and Claude
- [ ] Settings save and persist correctly
- [ ] PDF download generates properly
- [ ] History management functions correctly
- [ ] No console errors during normal usage

### Test Coverage Areas
1. **Job Detection**: Test on various job sites and page types
2. **AI Integration**: Test both OpenAI and Claude APIs
3. **User Interface**: Test all UI interactions and edge cases
4. **Storage**: Test data persistence and storage limits
5. **Error Handling**: Test various failure scenarios
6. **Performance**: Ensure responsive user experience

### Testing New Features
- Create test cases for new functionality
- Test edge cases and error conditions
- Verify backward compatibility
- Test on different Chrome versions if possible

## 🐛 Bug Reports

### Before Reporting
1. **Search Existing Issues**: Check if the bug is already reported
2. **Update Extension**: Ensure you're using the latest version
3. **Reproduce**: Confirm the bug is reproducible
4. **Environment**: Note your Chrome version and OS

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Chrome Version: [e.g. 120.0.6099.109]
- OS: [e.g. Windows 11, macOS 14.1]
- Extension Version: [e.g. 1.0.3]
- Job Site: [e.g. LinkedIn, Indeed]

**Console Errors**
Include any browser console errors.
```

## 💡 Feature Requests

### Before Requesting
1. **Search Existing**: Check if the feature is already requested
2. **Consider Scope**: Ensure the feature fits the extension's purpose
3. **Think Through**: Consider implementation challenges and user impact

### Feature Request Template
```markdown
**Feature Summary**
Brief description of the feature.

**Problem/Use Case**
What problem does this solve or what use case does it address?

**Proposed Solution**
Detailed description of how you envision this working.

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

## 📊 Architecture Overview

### Core Components
- **Background Service Worker** (`background.js`): API integration, storage, PDF generation
- **Content Script** (`content-script.js`): Job detection and data extraction
- **Popup Interface** (`popup.js`): Main user interface
- **Options Page** (`options.js`): Settings and configuration

### Key Design Principles
1. **Privacy First**: User data never leaves browser except for AI APIs
2. **Dual Provider Support**: Both OpenAI and Claude integration
3. **Reliability**: Robust error handling and fallback mechanisms
4. **User Experience**: Clear feedback and intuitive interface
5. **Extensibility**: Modular architecture for easy feature additions

## 🚨 Important Notes

### What We DON'T Accept
- **API Key Harvesting**: Code that collects or transmits user API keys
- **Data Mining**: Features that collect user data for external purposes
- **Spam/Self-Promotion**: PRs primarily for self-promotion
- **Major Architecture Changes**: Without prior discussion in issues
- **Breaking Changes**: Without version bump and migration plan

### Security Considerations
- All code contributions will be reviewed for security issues
- Never include actual API keys or personal data in code
- Be cautious with external dependencies
- Follow Chrome Web Store security policies

## 🏷️ Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0): Breaking changes or major feature releases
- **MINOR** (1.x.0): New features, backward compatible
- **PATCH** (1.0.x): Bug fixes, backward compatible

### Release Timeline
- **Patch Releases**: As needed for critical bug fixes
- **Minor Releases**: Monthly or when significant features are ready
- **Major Releases**: Quarterly or for significant architectural changes

## 🙏 Recognition

### Contributors
All contributors will be recognized in:
- **GitHub Contributors**: Automatic GitHub recognition
- **CHANGELOG.md**: Major contributions noted in releases
- **README.md**: Special recognition for significant contributions

### Types of Recognition
- **Code Contributors**: All code commits are attributed
- **Bug Reporters**: Credited in issue resolution
- **Feature Requests**: Credited when features are implemented
- **Documentation**: README and docs contributors recognized

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Primary channel for bugs and features
- **GitHub Discussions**: General questions and community support
- **Code Review**: Feedback provided in pull requests

### Maintainer Response Time
- **Security Issues**: Within 24 hours
- **Bug Reports**: Within 1-2 business days
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 1 week

### Mentorship
New contributors welcome! If you're new to:
- **Chrome Extensions**: We can help guide you through the basics
- **Open Source**: We'll help you learn the workflow
- **JavaScript/Web Development**: Point you to good learning resources

## 📝 Legal

### Contributor License Agreement
By contributing to this project, you agree that:
1. **Ownership**: Your contributions become part of the project under the MIT License
2. **Rights**: You have the right to make the contribution
3. **License**: Your contributions will be licensed under MIT License
4. **No Warranty**: Contributions are provided as-is without warranty

### Code of Conduct
This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

---

## 🎉 Thank You!

Thank you for contributing to AI Cover Letter Generator! Your contributions help job seekers worldwide create better cover letters and land their dream jobs. Every bug fix, feature, and documentation improvement makes a real difference in people's careers.

**Happy Contributing!** 🚀