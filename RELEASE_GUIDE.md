# Release Guide - Chrome Extension

This guide covers the automated release process using GitHub Actions for the AI Cover Letter Generator Chrome Extension.

## 🚀 Quick Start

**TL;DR**: Update the version in `manifest.json`, create a PR, merge it, and GitHub Actions handles the rest!

## 📋 Table of Contents

1. [Release Methods](#release-methods)
2. [PR-Based Release (Recommended)](#pr-based-release-recommended)
3. [Manual Release via GitHub UI](#manual-release-via-github-ui)
4. [Local Release Script](#local-release-script)
5. [Pre-Release Checklist](#pre-release-checklist)
6. [Post-Release Tasks](#post-release-tasks)
7. [Troubleshooting](#troubleshooting)

## Release Methods

We support three different release methods:

| Method | Best For | Automation Level | Review Process |
|--------|----------|------------------|----------------|
| **PR-Based** | Regular releases | 🤖 Full | ✅ Code review |
| **Manual GitHub** | Hotfixes, urgent releases | 🔄 Semi-auto | ⚠️ Direct to main |
| **Local Script** | Testing, development | 🛠️ Manual | 📝 Local only |

---

## PR-Based Release (Recommended)

This is the **recommended method** for most releases as it includes code review and testing.

### Step 1: Create Feature Branch

```bash
# Create and switch to a new branch
git checkout -b release/v1.0.1

# Or for feature releases
git checkout -b feature/new-ai-provider
```

### Step 2: Make Your Changes

Make your code changes, bug fixes, or feature additions.

### Step 3: Update Version

**Important**: You must update the version in `manifest.json` for the automation to trigger.

```json
{
  "manifest_version": 3,
  "name": "AI Cover Letter Generator",
  "version": "1.0.1",  // ← Update this line
  "description": "Generate personalized cover letters..."
}
```

**Version Bumping Guidelines:**
- **Patch** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **Minor** (1.0.0 → 1.1.0): New features, significant improvements  
- **Major** (1.0.0 → 2.0.0): Breaking changes, major rewrites

### Step 4: Create Pull Request

```bash
# Commit your changes
git add .
git commit -m "Release v1.0.1

- Fix job detection on LinkedIn
- Improve error handling for API timeouts
- Update UI components for better UX"

# Push to your branch
git push origin release/v1.0.1
```

Create a PR on GitHub using the provided template.

### Step 5: Automated Build

Once you create the PR, GitHub Actions will:

1. ✅ **Detect Version Change**: Compare `manifest.json` versions
2. 🏗️ **Build Extension**: Generate icons, validate manifest, create zip
3. 📦 **Create Artifact**: Store build for download
4. 💬 **Comment on PR**: Add status and testing checklist

**Example PR Comment:**
```
## 🎉 Version Bump Detected!

New version: `v1.0.1`

✅ Extension build completed successfully!
📦 Artifact: `chrome-extension-v1.0.1`

### Next Steps:
1. **Merge this PR** to automatically create a GitHub release
2. **Download** the extension package from the release
3. **Test** the extension before Chrome Web Store submission

### Testing Checklist:
- [ ] Extension loads without errors
- [ ] Job detection works on LinkedIn/Indeed
- [ ] Cover letter generation works with OpenAI/Claude
- [ ] PDF download functions properly
- [ ] Settings save correctly
- [ ] History management works
```

### Step 6: Test the Build

Download the artifact from the PR's "Checks" tab and test:

1. **Extract the zip file**
2. **Load in Chrome**: `chrome://extensions/` → Developer Mode → Load Unpacked
3. **Run through the testing checklist** in the PR comment
4. **Fix any issues** and push updates (will retrigger build)

### Step 7: Merge and Release

When ready:

1. **Get PR approved** (if you have collaborators)
2. **Merge the PR**
3. **GitHub Actions automatically creates a release** with:
   - 📋 Release notes with changelog
   - 📦 Downloadable zip file
   - 🏷️ Git tag (e.g., `v1.0.1`)
   - 🔗 Links to documentation

**Automatic Release Example:**
```
## AI Cover Letter Generator v1.0.1

🚀 **Ready for Chrome Web Store submission!**

### 📦 Installation
1. Download the `ai-cover-letter-generator-v1.0.1.zip` file
2. Extract the zip file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked" and select the extracted folder

### 🔗 Links
- 📚 Setup Guide
- 🏠 Project Website  
- 🐛 Report Issues

### Changes
See the CHANGELOG for detailed changes in this version.
```

---

## Manual Release via GitHub UI

Use this for **urgent hotfixes** or when you need to release without a PR.

### Step 1: Navigate to GitHub Actions

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. Select **"Manual Release"** from the workflow list
4. Click **"Run workflow"** button

### Step 2: Configure Release

Fill in the workflow inputs:

- **Version**: Enter the new version (e.g., `1.0.2`)
- **Prerelease**: Check if this is a beta/RC version

### Step 3: Monitor Build

The workflow will:

1. ✅ **Validate version format**
2. 📝 **Update `manifest.json`** automatically
3. 🏗️ **Build extension** (icons, validation, packaging)
4. 📋 **Commit version change** to main branch
5. 🚀 **Create GitHub release** with download link

### Step 4: Verify Release

Check that:
- ✅ Release appears in the "Releases" section
- ✅ Zip file is attached and downloadable  
- ✅ Version was committed to main branch
- ✅ Release notes look correct

---

## Local Release Script

Use this for **local testing** and **development builds**.

### Usage

```bash
# Make script executable (first time only)
chmod +x release.sh

# Create a release
./release.sh 1.0.1
```

### What It Does

The script will:

1. ✅ **Validate version format** (must be x.y.z)
2. 📝 **Update `manifest.json`** version
3. 🧹 **Clean development files**
4. 🎨 **Generate icons** using sharp
5. 📦 **Create zip package**
6. 📊 **Show package details** (size, contents)
7. 💡 **Provide next steps**

### Example Output

```bash
$ ./release.sh 1.0.1

[INFO] Preparing release for version 1.0.1
[INFO] Current version: 1.0.0
[INFO] Updating manifest.json version to 1.0.1
[SUCCESS] Version updated in manifest.json
[INFO] Generating icons...
🎨 Generating Chrome extension icons...
✅ Created icon16.png (16x16, 556 bytes)
✅ Created icon32.png (32x32, 1037 bytes)  
✅ Created icon48.png (48x48, 1078 bytes)
✅ Created icon128.png (128x128, 3221 bytes)
🎉 All PNG icons created successfully!

[INFO] Creating extension package...
[SUCCESS] Package created: ai-cover-letter-generator-v1.0.1.zip
[SUCCESS] Package size: 2MB (within Chrome Web Store limits)

[SUCCESS] Release v1.0.1 ready!

Next steps:
1. Test the extension package locally
2. Commit the version change: git add manifest.json && git commit -m 'Release v1.0.1'
3. Push to trigger GitHub Actions: git push
4. Or upload ai-cover-letter-generator-v1.0.1.zip to Chrome Web Store manually
```

### Local Testing

After running the script:

1. **Extract** the generated zip file
2. **Load in Chrome**: `chrome://extensions/` → Developer Mode → Load Unpacked
3. **Test thoroughly** before pushing
4. **Commit and push** when satisfied

---

## Pre-Release Checklist

Before creating any release, ensure:

### Code Quality
- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] Code follows project conventions
- [ ] Sensitive data removed (API keys, debug info)

### Version Management  
- [ ] Version number follows semantic versioning
- [ ] Version is higher than current version
- [ ] Changelog updated (if applicable)

### Testing
- [ ] Extension loads without errors
- [ ] Job detection works on major sites (LinkedIn, Indeed, Glassdoor)
- [ ] AI integration works (both OpenAI and Claude if applicable)
- [ ] Settings save and persist correctly
- [ ] PDF download functionality works
- [ ] History management works properly
- [ ] No data leaks or security issues

### Documentation
- [ ] README updated with new features
- [ ] API documentation updated (if needed)
- [ ] Support documentation reflects changes

---

## Post-Release Tasks

After a successful release:

### Immediate (Within 24 hours)
1. **Test the Release**
   - Download and test the released package
   - Verify all functionality works
   - Check for any regression issues

2. **Update Documentation**
   - Ensure GitHub Pages site reflects new version
   - Update any external documentation
   - Announce on relevant channels

### Short-term (Within 1 week)
1. **Monitor for Issues**
   - Watch GitHub issues for user reports
   - Monitor extension performance
   - Check analytics if available

2. **Chrome Web Store** (if applicable)
   - Upload new version to Chrome Web Store
   - Update store description if needed
   - Monitor store reviews and ratings

### Planning
1. **Plan Next Release**
   - Review feedback and issues
   - Plan next features/improvements
   - Update project roadmap

---

## Troubleshooting

### Common Issues

#### ❌ Build Failed: "Version not changed"
**Cause**: Version in `manifest.json` wasn't updated or is the same as previous version.

**Solution**:
```bash
# Check current version
npm run version-check

# Update manifest.json
# Edit the "version" field to a higher number
# Commit and push changes
```

#### ❌ Build Failed: "Invalid version format"
**Cause**: Version doesn't follow x.y.z format.

**Solution**:
```json
// ❌ Wrong formats
"version": "1.0"        // Missing patch
"version": "v1.0.0"     // Has 'v' prefix  
"version": "1.0.0-beta" // Has suffix

// ✅ Correct format
"version": "1.0.0"
```

#### ❌ Build Failed: "Package too large"
**Cause**: Extension package exceeds Chrome Web Store 50MB limit.

**Solution**:
1. **Check what's included**:
   ```bash
   unzip -l ai-cover-letter-generator-v1.0.1.zip
   ```

2. **Common large files to exclude**:
   - High-resolution images
   - Unnecessary dependencies
   - Development/debug files
   - Large documentation files

3. **Update `.gitignore`** to exclude large files

#### ❌ Release Created but Zip Missing
**Cause**: Upload step failed but release was created.

**Solution**:
1. **Delete the release** from GitHub
2. **Fix the issue** (usually package name or path)
3. **Retrigger the workflow** or create a new release

### Getting Help

If you encounter issues not covered here:

1. **Check Workflow Logs**:
   - Go to Actions tab in GitHub
   - Click on the failed workflow
   - Review the step-by-step logs

2. **Common Log Locations**:
   - Build failures: "Build Extension" step
   - Upload failures: "Upload release asset" step  
   - Version issues: "Detect Version Change" step

3. **Report Issues**:
   - Create an issue with workflow logs
   - Include the version you were trying to release
   - Describe what you expected vs. what happened

---

## Advanced Usage

### Custom Release Notes

To customize release notes, edit the GitHub Action workflow file:

```yaml
# .github/workflows/build-extension.yml
# Find the "Create release" step and modify the body content
body: |
  ## AI Cover Letter Generator v${{ env.VERSION }}
  
  Custom release notes here...
```

### Conditional Builds

To skip builds on certain changes:

```yaml
# Add to the workflow's paths filter
paths-ignore:
  - 'docs/**'
  - '*.md'
  - '.github/**'
```

### Pre-release Versions

For beta/RC releases:

1. **Use Manual Release workflow**
2. **Check "Mark as prerelease"**
3. **Use version like**: `1.1.0` (GitHub will mark as prerelease)

---

## Quick Reference

### Version Bumping
```bash
# Check current version
npm run version-check

# Bump version types
1.0.0 → 1.0.1  # Patch (bug fixes)
1.0.0 → 1.1.0  # Minor (new features)  
1.0.0 → 2.0.0  # Major (breaking changes)
```

### NPM Scripts
```bash
npm run build          # Generate icons
npm run package        # Create release zip
npm run clean          # Remove dev files
npm run validate       # Check manifest
npm run version-check  # Show version
```

### Release Commands  
```bash
./release.sh 1.0.1     # Local release
git tag -a v1.0.1 -m "Release v1.0.1"  # Manual tag
```

---

**Happy releasing! 🚀**

For more information, see:
- [Contributing Guide](CONTRIBUTING.md)
- [Support Documentation](https://netors.github.io/job-cover-letter-chrome-extension/support.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)