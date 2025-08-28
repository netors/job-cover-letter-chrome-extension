class JobDetector {
  constructor() {
    this.jobKeywords = [
      'job description', 'responsibilities', 'requirements', 'qualifications',
      'experience', 'skills', 'education', 'salary', 'benefits', 'apply',
      'position', 'role', 'opportunity', 'candidate', 'team', 'company',
      'duties', 'expectations', 'preferred', 'must have', 'nice to have',
      'about the job', 'about this role', 'what you\'ll do', 'we are looking for'
    ];
    
    this.jobSites = [
      'linkedin.com', 'indeed.com', 'glassdoor.com', 'monster.com',
      'ziprecruiter.com', 'angellist.com', 'dice.com', 'careerbuilder.com',
      'workday.com', 'greenhouse.io', 'lever.co', 'smartrecruiters.com'
    ];
    
    this.floatingButton = null;
    this.isJobPage = false;
    this.debugMode = true; // Enable debugging
  }

  detectJobDescription() {
    if (this.debugMode) {
      console.group('🔍 AI Cover Letter - Job Detection Debug');
    }
    
    const url = window.location.hostname.toLowerCase();
    const currentUrl = window.location.href;
    const pageText = document.body.innerText.toLowerCase();
    
    if (this.debugMode) {
      console.log('Current URL:', currentUrl);
      console.log('Hostname:', url);
      console.log('Page text length:', pageText.length);
      console.log('First 500 chars:', pageText.substring(0, 500));
    }
    
    // Check if it's a known job site
    const isJobSite = this.jobSites.some(site => url.includes(site));
    if (this.debugMode) {
      console.log('Is known job site:', isJobSite);
    }
    
    // LinkedIn-specific detection
    const isLinkedInJob = url.includes('linkedin.com') && (
      currentUrl.includes('/jobs/view/') || 
      currentUrl.includes('/jobs/search/') ||
      document.querySelector('.jobs-search__job-details') ||
      document.querySelector('.job-details-jobs-unified-top-card') ||
      document.querySelector('[data-job-id]')
    );
    
    if (this.debugMode) {
      console.log('LinkedIn job detection:', isLinkedInJob);
    }
    
    // Count relevant keywords
    const foundKeywords = this.jobKeywords.filter(keyword => 
      pageText.includes(keyword)
    );
    
    if (this.debugMode) {
      console.log('Keywords found:', foundKeywords.length, foundKeywords);
    }
    
    // Check structured data
    const hasStructuredData = this.checkStructuredData();
    if (this.debugMode) {
      console.log('Has structured data:', hasStructuredData);
    }
    
    // LinkedIn specific elements check
    const linkedInElements = this.checkLinkedInElements();
    if (this.debugMode) {
      console.log('LinkedIn elements found:', linkedInElements);
    }
    
    this.isJobPage = isJobSite && (foundKeywords.length >= 3 || hasStructuredData || isLinkedInJob || linkedInElements);
    
    if (this.debugMode) {
      console.log('Final decision - Is Job Page:', this.isJobPage);
      console.groupEnd();
    }
    
    if (this.isJobPage) {
      console.log('✅ Job description detected on this page');
      this.showFloatingButton();
      this.extractJobData();
    } else {
      console.log('❌ No job description detected');
    }
    
    return this.isJobPage;
  }

  checkStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@type'] === 'JobPosting' || data.jobPosting) {
          if (this.debugMode) {
            console.log('Found JobPosting structured data:', data);
          }
          return true;
        }
      } catch (e) {
        if (this.debugMode) {
          console.log('Error parsing structured data:', e);
        }
        continue;
      }
    }
    return false;
  }

  checkLinkedInElements() {
    // LinkedIn-specific selectors for job pages
    const linkedInSelectors = [
      '.jobs-search__job-details',
      '.job-details-jobs-unified-top-card',
      '.jobs-unified-top-card',
      '.job-details-module',
      '.jobs-box__html-content',
      '.jobs-description-content',
      '[data-job-id]',
      '.jobs-details',
      '.jobs-box__group',
      '.job-details-jobs-unified-top-card__job-title',
      '.job-details-jobs-unified-top-card__company-name'
    ];
    
    const foundElements = [];
    for (const selector of linkedInSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        foundElements.push(selector);
        if (this.debugMode) {
          console.log(`Found LinkedIn element: ${selector}`, element);
        }
      }
    }
    
    if (this.debugMode && foundElements.length === 0) {
      console.log('No LinkedIn job elements found. Available classes:', 
        Array.from(document.querySelectorAll('[class*="job"]')).map(el => el.className).slice(0, 10)
      );
    }
    
    return foundElements.length > 0;
  }

  extractJobData() {
    const data = {
      url: window.location.href,
      title: this.extractJobTitle(),
      company: this.extractCompany(),
      description: this.extractDescription(),
      requirements: this.extractRequirements(),
      responsibilities: this.extractResponsibilities(),
      extractedAt: new Date().toISOString()
    };
    
    if (this.debugMode) {
      console.log('📋 Extracted job data:', {
        url: data.url,
        title: data.title,
        company: data.company,
        descriptionLength: data.description ? data.description.length : 0,
        requirementsCount: data.requirements ? data.requirements.length : 0,
        responsibilitiesCount: data.responsibilities ? data.responsibilities.length : 0
      });
    }
    
    return data;
  }

  extractJobTitle() {
    // LinkedIn-specific selectors first
    const linkedInSelectors = [
      '.job-details-jobs-unified-top-card__job-title',
      '.jobs-unified-top-card__job-title',
      '.jobs-search__job-details--wrapper h1',
      '.job-details-jobs-unified-top-card__job-title h1'
    ];
    
    // General selectors
    const generalSelectors = [
      'h1', '[class*="job-title"]', '[class*="jobTitle"]',
      '[data-test*="job-title"]', '[role="heading"]'
    ];
    
    const allSelectors = [...linkedInSelectors, ...generalSelectors];
    
    for (const selector of allSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        const title = element.textContent.trim();
        if (this.debugMode) {
          console.log(`Job title found with selector "${selector}":`, title);
        }
        return title;
      }
    }
    
    const titleMatch = document.title.match(/^([^|,-]+)/);
    const fallbackTitle = titleMatch ? titleMatch[1].trim() : 'Job Position';
    
    if (this.debugMode) {
      console.log('Job title fallback from document.title:', fallbackTitle);
    }
    
    return fallbackTitle;
  }

  extractCompany() {
    // LinkedIn-specific selectors
    const linkedInSelectors = [
      '.job-details-jobs-unified-top-card__company-name',
      '.jobs-unified-top-card__company-name',
      '.job-details-jobs-unified-top-card__company-name a',
      '.jobs-unified-top-card__subtitle-primary-grouping .jobs-unified-top-card__company-name',
      'a[data-control-name="company_link"]'
    ];
    
    const generalSelectors = [
      '[class*="company"]', '[data-test*="company"]',
      '[class*="employer"]'
    ];
    
    const allSelectors = [...linkedInSelectors, ...generalSelectors];
    
    for (const selector of allSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        const company = element.textContent.trim();
        if (this.debugMode) {
          console.log(`Company found with selector "${selector}":`, company);
        }
        return company;
      }
    }
    
    if (this.debugMode) {
      console.log('Company fallback: Company');
    }
    
    return 'Company';
  }

  extractDescription() {
    // LinkedIn-specific selectors
    const linkedInSelectors = [
      '.jobs-box__html-content',
      '.jobs-description-content__text',
      '.jobs-box__group .jobs-box__html-content',
      '.job-details-module',
      '.jobs-description .jobs-box__html-content'
    ];
    
    const generalSelectors = [
      '[class*="description"]', '[class*="job-description"]',
      '[data-test*="description"]', 'section[class*="description"]',
      'div[class*="content"]'
    ];
    
    const allSelectors = [...linkedInSelectors, ...generalSelectors];
    
    for (const selector of allSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.length > 100) {
        const description = element.textContent.trim();
        if (this.debugMode) {
          console.log(`Description found with selector "${selector}" (${description.length} chars):`, description.substring(0, 200) + '...');
        }
        return description;
      }
    }
    
    // Fallback to main content
    const mainContent = document.querySelector('main') || document.body;
    const fallbackDescription = mainContent.textContent.substring(0, 5000).trim();
    
    if (this.debugMode) {
      console.log('Description fallback from main content:', fallbackDescription.substring(0, 200) + '...');
    }
    
    return fallbackDescription;
  }

  extractRequirements() {
    const requirementsSection = this.findSectionByHeading(['requirements', 'qualifications', 'skills']);
    if (requirementsSection) {
      return this.extractListItems(requirementsSection);
    }
    return [];
  }

  extractResponsibilities() {
    const responsibilitiesSection = this.findSectionByHeading(['responsibilities', 'duties', 'role']);
    if (responsibilitiesSection) {
      return this.extractListItems(responsibilitiesSection);
    }
    return [];
  }

  findSectionByHeading(keywords) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
    for (const heading of headings) {
      const text = heading.textContent.toLowerCase();
      if (keywords.some(keyword => text.includes(keyword))) {
        let nextElement = heading.nextElementSibling;
        while (nextElement && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nextElement.tagName)) {
          if (nextElement.querySelector('ul, ol') || nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
            return nextElement;
          }
          nextElement = nextElement.nextElementSibling;
        }
      }
    }
    return null;
  }

  extractListItems(element) {
    const items = [];
    const listItems = element.querySelectorAll('li');
    listItems.forEach(li => {
      const text = li.textContent.trim();
      if (text) items.push(text);
    });
    return items;
  }

  showFloatingButton() {
    if (this.floatingButton) return;
    
    this.floatingButton = document.createElement('div');
    this.floatingButton.className = 'ai-cover-letter-button';
    this.floatingButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <span class="tooltip">Generate Cover Letter</span>
    `;
    
    this.floatingButton.addEventListener('click', () => this.handleGenerateClick());
    document.body.appendChild(this.floatingButton);
    
    setTimeout(() => {
      this.floatingButton.classList.add('visible');
    }, 500);
  }

  async handleGenerateClick() {
    const jobData = this.extractJobData();
    
    this.floatingButton.classList.add('loading');
    this.floatingButton.querySelector('svg').style.display = 'none';
    this.floatingButton.innerHTML += '<div class="spinner"></div>';
    
    try {
      const settings = await chrome.storage.sync.get(['apiKey', 'resume', 'personalInfo', 'preferences']);
      
      if (!settings.apiKey) {
        this.showNotification('Please set your OpenAI API key in the extension settings', 'error');
        chrome.runtime.sendMessage({ action: 'openOptions' });
        return;
      }
      
      const response = await chrome.runtime.sendMessage({
        action: 'generateCoverLetter',
        jobData: jobData,
        settings: settings
      });
      
      if (response.success) {
        this.showCoverLetterModal(response.coverLetter, jobData);
      } else {
        this.showNotification(response.error || 'Failed to generate cover letter', 'error');
      }
    } catch (error) {
      this.showNotification('Error: ' + error.message, 'error');
    } finally {
      this.floatingButton.classList.remove('loading');
      this.floatingButton.querySelector('.spinner')?.remove();
      this.floatingButton.querySelector('svg').style.display = 'block';
    }
  }

  showCoverLetterModal(coverLetter, jobData) {
    const modal = document.createElement('div');
    modal.className = 'ai-cover-letter-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Generated Cover Letter</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="job-info">
            <p><strong>Position:</strong> ${jobData.title}</p>
            <p><strong>Company:</strong> ${jobData.company}</p>
          </div>
          <div class="cover-letter-content" contenteditable="true">
            ${coverLetter.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-copy">Copy to Clipboard</button>
          <button class="btn btn-download">Download as PDF</button>
          <button class="btn btn-regenerate">Regenerate</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.btn-copy').addEventListener('click', () => {
      const content = modal.querySelector('.cover-letter-content').innerText;
      navigator.clipboard.writeText(content);
      this.showNotification('Cover letter copied to clipboard!', 'success');
    });
    
    modal.querySelector('.btn-download').addEventListener('click', async () => {
      const content = modal.querySelector('.cover-letter-content').innerText;
      
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'downloadPDF',
          content: content,
          jobData: jobData
        });
        
        if (response && response.success) {
          this.showNotification('Cover letter download started!', 'success');
        } else {
          this.showNotification('Download failed: ' + (response?.error || 'Unknown error'), 'error');
        }
      } catch (error) {
        console.error('Download error:', error);
        this.showNotification('Download failed: ' + error.message, 'error');
      }
    });
    
    modal.querySelector('.btn-regenerate').addEventListener('click', async () => {
      modal.remove();
      await this.handleGenerateClick();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `ai-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('visible');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

const detector = new JobDetector();

// Set flag to indicate manual injection
window.aiCoverLetterExtensionInjected = true;

// Wait for DOM and handle dynamic content loading
function initializeDetector() {
  console.log('🚀 Content script manually injected - running job detection immediately');
  detector.detectJobDescription();
  
  // For LinkedIn, also check after additional delays since content loads dynamically
  if (window.location.hostname.includes('linkedin.com')) {
    setTimeout(() => {
      console.log('LinkedIn: Re-checking after 2 seconds');
      detector.detectJobDescription();
    }, 2000);
    
    setTimeout(() => {
      console.log('LinkedIn: Re-checking after 5 seconds');
      detector.detectJobDescription();
    }, 5000);
  }
}

// For manual injection, run immediately regardless of document state
console.log('📋 Content script loaded, initializing detector...');
initializeDetector();

// Also run after a short delay to catch dynamic content
setTimeout(() => {
  console.log('🔄 Running delayed detection for dynamic content...');
  detector.detectJobDescription();
}, 500);

// Also listen for URL changes (for SPAs like LinkedIn)
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    console.log('URL changed, re-detecting job description');
    setTimeout(() => {
      detector.detectJobDescription();
    }, 2000);
  }
}).observe(document, { subtree: true, childList: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkJobPage') {
    sendResponse({ isJobPage: detector.isJobPage });
  } else if (request.action === 'extractJobData') {
    sendResponse(detector.extractJobData());
  } else if (request.action === 'forceDetection') {
    detector.detectJobDescription();
    sendResponse({ isJobPage: detector.isJobPage });
  }
  return true;
});