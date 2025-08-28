#!/bin/bash

# Chrome Extension Release Script
# Usage: ./release.sh [version]
# Example: ./release.sh 1.0.1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if version is provided
if [ $# -eq 0 ]; then
    print_error "Version number required!"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.1"
    exit 1
fi

NEW_VERSION=$1

# Validate version format
if [[ ! "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format: $NEW_VERSION"
    echo "Expected format: x.y.z (e.g., 1.0.1)"
    exit 1
fi

print_status "Preparing release for version $NEW_VERSION"

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    print_error "manifest.json not found. Are you in the extension directory?"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(jq -r '.version' manifest.json)
print_status "Current version: $CURRENT_VERSION"

# Check if version is actually different
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    print_warning "Version is already $NEW_VERSION"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Release cancelled"
        exit 0
    fi
fi

# Update version in manifest.json
print_status "Updating manifest.json version to $NEW_VERSION"
jq ".version = \"$NEW_VERSION\"" manifest.json > manifest.json.tmp
mv manifest.json.tmp manifest.json

# Verify the update
UPDATED_VERSION=$(jq -r '.version' manifest.json)
if [ "$UPDATED_VERSION" != "$NEW_VERSION" ]; then
    print_error "Failed to update version in manifest.json"
    exit 1
fi

print_success "Version updated in manifest.json"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/sharp/package.json" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Clean old build artifacts
print_status "Cleaning old build files..."
npm run clean 2>/dev/null || {
    rm -f *.debug.md test-storage.js
    rm -f DEBUG.md GENERATION_DEBUG.md INSTALLATION.md
    rm -f INSTRUCTIONS_FOR_IMPROVEMENTS.md PERSISTENCE_TESTING.md
    rm -f STORAGE_QUOTA_FIX.md
}

# Generate icons
print_status "Generating icons..."
npm run build

# Validate manifest
print_status "Validating manifest..."
npm run validate

# Create package
print_status "Creating extension package..."
npm run create-zip

PACKAGE_NAME="ai-cover-letter-generator-v${NEW_VERSION}.zip"

if [ -f "$PACKAGE_NAME" ]; then
    print_success "Package created: $PACKAGE_NAME"
    
    # Show package info
    echo
    print_status "Package Details:"
    ls -lh "$PACKAGE_NAME"
    echo
    print_status "Package Contents:"
    unzip -l "$PACKAGE_NAME" | head -20
    
    # Check package size
    SIZE=$(stat -f%z "$PACKAGE_NAME" 2>/dev/null || stat -c%s "$PACKAGE_NAME")
    SIZE_MB=$((SIZE / 1024 / 1024))
    
    if [ $SIZE_MB -gt 50 ]; then
        print_warning "Package size is ${SIZE_MB}MB (Chrome Web Store limit is 50MB)"
    else
        print_success "Package size: ${SIZE_MB}MB (within Chrome Web Store limits)"
    fi
else
    print_error "Failed to create package"
    exit 1
fi

echo
print_success "Release v$NEW_VERSION ready!"
echo
print_status "Next steps:"
echo "1. Test the extension package locally"
echo "2. Commit the version change: git add manifest.json && git commit -m 'Release v$NEW_VERSION'"
echo "3. Push to trigger GitHub Actions: git push"
echo "4. Or upload $PACKAGE_NAME to Chrome Web Store manually"
echo
print_status "To test locally:"
echo "1. Extract $PACKAGE_NAME"
echo "2. Load in Chrome: chrome://extensions/ → Developer Mode → Load Unpacked"