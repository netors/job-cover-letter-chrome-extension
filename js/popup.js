class PopupManager {
  constructor() {
    this.currentTab = null;
    this.jobData = null;
    this.init();
  }

  async init() {
    console.log('🚀 Popup initializing...');
    try {
      await this.getCurrentTab();
      console.log('✅ Got current tab');
      
      await this.checkApiKey();
      console.log('✅ Checked API key');
      
      await this.checkJobPage();
      console.log('✅ Checked job page');
      
      await this.loadHistory();
      console.log('✅ Loaded history');
      
      await this.loadProviderSettings();
      console.log('✅ Loaded provider settings');
      
      this.bindEvents();
      console.log('✅ Bound events');
      
      this.updateUsageStats();
      console.log('✅ Updated usage stats');
      
      await this.debugStorage();
      console.log('✅ Debug storage complete');
      
    } catch (error) {
      console.error('❌ Error during popup initialization:', error);
      // Show error state
      const statusIndicator = document.getElementById('statusIndicator');
      const statusText = document.getElementById('statusText');
      if (statusIndicator && statusText) {
        statusIndicator.className = 'status-indicator error';
        statusText.textContent = 'Popup initialization failed';
      }
    }
  }

  async loadProviderSettings() {
    try {
      const settings = await chrome.runtime.sendMessage({
        action: 'getStorageData',
        keys: ['provider', 'preferences', 'openaiApiKey', 'claudeApiKey', 'apiKey']
      });

      const provider = settings.provider || 'openai';
      const preferences = settings.preferences || {};

      // Set provider
      document.getElementById('providerSelect').value = provider;
      
      // Update model options
      this.updateModelOptions(provider, preferences);
      
      // Add event listener for provider change
      document.getElementById('providerSelect').addEventListener('change', (e) => {
        this.updateModelOptions(e.target.value, preferences);
      });
      
    } catch (error) {
      console.error('Error loading provider settings:', error);
    }
  }

  updateModelOptions(provider, preferences = {}) {
    const modelSelect = document.getElementById('modelSelect');
    const currentModel = preferences.model;
    
    if (provider === 'claude') {
      modelSelect.innerHTML = `
        <option value="claude-3-5-sonnet-20241022" ${currentModel === 'claude-3-5-sonnet-20241022' ? 'selected' : ''}>Claude 3.5 Sonnet</option>
        <option value="claude-3-5-haiku-20241022" ${currentModel === 'claude-3-5-haiku-20241022' ? 'selected' : ''}>Claude 3.5 Haiku</option>
        <option value="claude-3-opus-20240229" ${currentModel === 'claude-3-opus-20240229' ? 'selected' : ''}>Claude 3 Opus</option>
        <option value="claude-3-sonnet-20240229" ${currentModel === 'claude-3-sonnet-20240229' ? 'selected' : ''}>Claude 3 Sonnet</option>
        <option value="claude-3-haiku-20240307" ${currentModel === 'claude-3-haiku-20240307' ? 'selected' : ''}>Claude 3 Haiku</option>
      `;
    } else {
      modelSelect.innerHTML = `
        <option value="gpt-4o" ${currentModel === 'gpt-4o' ? 'selected' : ''}>GPT-4o</option>
        <option value="gpt-4o-mini" ${currentModel === 'gpt-4o-mini' || !currentModel ? 'selected' : ''}>GPT-4o Mini</option>
        <option value="gpt-4-turbo" ${currentModel === 'gpt-4-turbo' ? 'selected' : ''}>GPT-4 Turbo</option>
        <option value="gpt-3.5-turbo" ${currentModel === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
      `;
    }
  }

  async debugStorage() {
    // Debug function to check what's in storage
    try {
      const stored = await chrome.runtime.sendMessage({
        action: 'getStorageData',
        keys: ['apiKey', 'personalInfo', 'resume', 'preferences']
      });
      
      console.log('🔍 Popup storage debug:', {
        hasApiKey: !!stored.apiKey,
        hasPersonalInfo: !!stored.personalInfo,
        hasResume: !!stored.resume,
        hasPreferences: !!stored.preferences,
        data: stored
      });
    } catch (error) {
      console.error('❌ Popup storage debug failed:', error);
    }
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
  }

  async checkApiKey() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'checkAuth' });
      const statusElement = document.getElementById('apiStatus');
      const dot = statusElement.querySelector('.dot');
      
      if (response.hasApiKey) {
        statusElement.classList.add('active');
        dot.style.backgroundColor = '#10b981';
        statusElement.title = 'API Key configured';
      } else {
        statusElement.classList.add('error');
        dot.style.backgroundColor = '#ef4444';
        statusElement.title = 'API Key not configured';
      }
    } catch (error) {
      console.error('Error checking API key:', error);
    }
  }

  async checkJobPage() {
    console.log('🔍 checkJobPage starting...');
    const statusSection = document.getElementById('statusSection');
    const actionSection = document.getElementById('actionSection');
    const noJobSection = document.getElementById('noJobSection');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    // Show loading state immediately
    statusIndicator.className = 'status-indicator';
    statusText.textContent = 'Detecting job description...';
    statusSection.style.display = 'block';
    actionSection.style.display = 'none';
    noJobSection.style.display = 'none';
    console.log('✅ Set loading state');

    try {
      // Add a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('✅ Loading delay complete');
      
      console.log('📤 Sending checkJobPage message to tab:', this.currentTab.id);
      const response = await chrome.tabs.sendMessage(this.currentTab.id, { 
        action: 'checkJobPage' 
      });
      console.log('📥 checkJobPage response:', response);

      if (response && response.isJobPage) {
        console.log('✅ Job page detected, extracting data...');
        // Update to extracting state
        statusText.textContent = 'Extracting job details...';
        
        console.log('📤 Sending extractJobData message...');
        const jobDataResponse = await chrome.tabs.sendMessage(this.currentTab.id, { 
          action: 'extractJobData' 
        });
        console.log('📥 Job data response:', jobDataResponse);
        
        this.jobData = jobDataResponse;
        
        statusIndicator.className = 'status-indicator success';
        statusText.textContent = 'Job description detected!';
        
        document.getElementById('jobTitle').textContent = this.jobData.title || 'Unknown Position';
        document.getElementById('jobCompany').textContent = this.jobData.company || 'Unknown Company';
        console.log('✅ Updated job info display');
        
        setTimeout(() => {
          console.log('✅ Switching to action section');
          statusSection.style.display = 'none';
          actionSection.style.display = 'block';
        }, 1000);
      } else {
        console.log('❌ No job page detected');
        statusIndicator.className = 'status-indicator error';
        statusText.textContent = 'No job description found';
        
        setTimeout(() => {
          statusSection.style.display = 'none';
          noJobSection.style.display = 'block';
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error checking job page:', error);
      statusIndicator.className = 'status-indicator error';
      statusText.textContent = 'Unable to analyze page - try refreshing';
      
      setTimeout(() => {
        statusSection.style.display = 'none';
        noJobSection.style.display = 'block';
      }, 1500);
    }
  }

  async loadHistory() {
    const stored = await chrome.runtime.sendMessage({
      action: 'getStorageData',
      keys: ['history']
    });
    const history = stored.history || [];
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-message">No cover letters generated yet</p>';
      return;
    }

    // Sort history: pinned items first, then same URL as current tab, then by date
    const currentUrl = this.currentTab?.url || '';
    const sortedHistory = this.sortHistoryByRelevance(history, currentUrl);

    historyList.innerHTML = sortedHistory.slice(0, 5).map(item => {
      const isPinned = item.pinned || false;
      const isSameUrl = item.url === currentUrl;
      let domain = '';
      let domainDisplay = '';
      try {
        if (item.url) {
          const urlObj = new URL(item.url);
          domain = urlObj.hostname;
          domainDisplay = `<a href="${item.url}" target="_blank" class="history-domain-link" title="Open original job posting">${domain} 🔗</a>`;
        }
      } catch (e) {
        domain = '';
        domainDisplay = '';
      }
      
      // Get AI provider icon and info
      const provider = item.provider || 'openai';
      const model = item.model || (provider === 'claude' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o-mini');
      let providerIcon = '';
      let providerTitle = '';
      
      if (provider === 'claude') {
        providerIcon = '🤖';
        providerTitle = `Generated with Claude (${model})`;
      } else {
        providerIcon = '🧠';
        providerTitle = `Generated with OpenAI (${model})`;
      }
      
      return `
        <div class="history-item ${isPinned ? 'pinned' : ''} ${isSameUrl ? 'same-url' : ''}" data-id="${item.id}">
          <div class="history-info">
            <strong>${item.jobTitle}</strong>
            <span>${item.company}</span>
            ${domainDisplay}
            <div class="history-meta">
              <time>${new Date(item.generatedAt).toLocaleDateString()}</time>
              <span class="ai-provider-badge" title="${providerTitle}">
                ${providerIcon} ${provider === 'claude' ? 'Claude' : 'OpenAI'}
              </span>
            </div>
          </div>
          <div class="history-actions">
            <button class="pin-btn" data-id="${item.id}" title="${isPinned ? 'Unpin' : 'Pin to top'}">
              ${isPinned ? '📌' : '📍'}
            </button>
            <button class="view-btn" data-id="${item.id}">View</button>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners for view buttons
    historyList.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const item = history.find(h => h.id === id);
        if (item) {
          this.showCoverLetter(item.coverLetter);
        }
      });
    });

    // Add event listeners for pin buttons
    historyList.querySelectorAll('.pin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.target.dataset.id;
        this.togglePin(id);
      });
    });
  }

  sortHistoryByRelevance(history, currentUrl) {
    return history.sort((a, b) => {
      // Pinned items always come first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Among unpinned items, same URL comes first
      const aIsSameUrl = a.url === currentUrl;
      const bIsSameUrl = b.url === currentUrl;
      if (aIsSameUrl && !bIsSameUrl) return -1;
      if (!aIsSameUrl && bIsSameUrl) return 1;
      
      // Otherwise sort by date (newest first)
      return new Date(b.generatedAt) - new Date(a.generatedAt);
    });
  }

  async togglePin(itemId) {
    try {
      const stored = await chrome.runtime.sendMessage({
        action: 'getStorageData',
        keys: ['history']
      });
      const history = stored.history || [];
      
      const itemIndex = history.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return;
      
      history[itemIndex].pinned = !history[itemIndex].pinned;
      
      await chrome.runtime.sendMessage({
        action: 'setStorageData',
        data: { history }
      });
      
      this.showNotification(
        history[itemIndex].pinned ? 'Pinned to top!' : 'Unpinned',
        'success'
      );
      
      await this.loadHistory(); // Reload to show updated order
    } catch (error) {
      console.error('Error toggling pin:', error);
      this.showNotification('Failed to pin item', 'error');
    }
  }

  bindEvents() {
    console.log('🔧 Binding events...');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        console.log('⚙️ Settings button clicked');
        chrome.runtime.openOptionsPage();
      });
      console.log('✅ Settings button event bound');
    } else {
      console.error('❌ Settings button not found in DOM');
    }

    document.getElementById('generateBtn').addEventListener('click', () => {
      this.generateCoverLetter();
    });

    document.getElementById('extractBtn').addEventListener('click', () => {
      this.showExtractedData();
    });

    document.getElementById('forceDetectBtn').addEventListener('click', async () => {
      await this.forceDetection();
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
      this.copyCoverLetter();
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadCoverLetter();
    });

    document.getElementById('regenerateBtn').addEventListener('click', () => {
      this.generateCoverLetter();
    });

    document.getElementById('closeResultBtn').addEventListener('click', () => {
      document.getElementById('resultSection').style.display = 'none';
      document.getElementById('actionSection').style.display = 'block';
    });

    document.getElementById('closeExtractedBtn').addEventListener('click', () => {
      document.getElementById('extractedDataSection').style.display = 'none';
      document.getElementById('actionSection').style.display = 'block';
    });

    document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
      if (confirm('Clear all cover letter history?')) {
        await chrome.runtime.sendMessage({
          action: 'setStorageData',
          data: { history: [] }
        });
        await this.loadHistory();
        this.updateUsageStats();
      }
    });
  }

  async generateCoverLetter() {
    const generateBtn = document.getElementById('generateBtn');
    const originalContent = generateBtn.innerHTML;
    
    console.log('🚀 Starting cover letter generation...');
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="spinner"></div> Generating...';

    try {
      console.log('📖 Retrieving settings from storage...');
      
      const settings = await chrome.runtime.sendMessage({
        action: 'getStorageData',
        keys: ['apiKey', 'openaiApiKey', 'claudeApiKey', 'provider', 'resume', 'personalInfo', 'preferences']
      });
      
      console.log('📋 Settings retrieved:', {
        provider: settings.provider || 'openai',
        hasOpenAI: !!(settings.openaiApiKey || settings.apiKey),
        hasClaude: !!settings.claudeApiKey,
        hasResume: !!settings.resume,
        hasPersonalInfo: !!settings.personalInfo,
        hasPreferences: !!settings.preferences
      });
      
      // Get current selections from popup
      const selectedProvider = document.getElementById('providerSelect').value;
      const selectedModel = document.getElementById('modelSelect').value;
      
      // Override settings with popup selections
      const finalSettings = {
        ...settings,
        provider: selectedProvider,
        preferences: {
          ...settings.preferences,
          provider: selectedProvider,
          model: selectedModel
        }
      };
      
      const hasValidApiKey = selectedProvider === 'claude' ? !!settings.claudeApiKey : !!(settings.openaiApiKey || settings.apiKey);
      
      if (!hasValidApiKey) {
        console.error('❌ No API key found for provider:', selectedProvider);
        this.showNotification(`Please set your ${selectedProvider === 'claude' ? 'Claude' : 'OpenAI'} API key in settings`, 'error');
        setTimeout(() => {
          chrome.runtime.openOptionsPage();
        }, 2000);
        return;
      }

      console.log('📝 Job data to send:', this.jobData);
      console.log('⚙️ Using provider:', selectedProvider, 'with model:', selectedModel);
      console.log('⚙️ Sending generation request...');

      const response = await chrome.runtime.sendMessage({
        action: 'generateCoverLetter',
        jobData: this.jobData,
        settings: finalSettings
      });

      console.log('📥 Generation response:', response);

      if (response && response.success) {
        console.log('✅ Cover letter generated successfully');
        this.showCoverLetter(response.coverLetter);
        await this.loadHistory();
        this.updateUsageStats();
        this.showNotification('Cover letter generated successfully!', 'success');
      } else {
        console.error('❌ Generation failed:', response);
        this.showNotification(response?.error || 'Failed to generate cover letter', 'error');
      }
    } catch (error) {
      console.error('❌ Generation error:', error);
      this.showNotification('Error: ' + error.message, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalContent;
    }
  }

  showCoverLetter(content) {
    document.getElementById('coverLetterContent').innerHTML = content.replace(/\n/g, '<br>');
    document.getElementById('actionSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
  }

  showExtractedData() {
    // Create a nicely formatted HTML version instead of raw JSON
    const data = this.jobData;
    const content = `
      <div class="extracted-field">
        <strong>URL:</strong> <a href="${data.url}" target="_blank">${data.url}</a>
      </div>
      <div class="extracted-field">
        <strong>Job Title:</strong> ${data.title || 'Not found'}
      </div>
      <div class="extracted-field">
        <strong>Company:</strong> ${data.company || 'Not found'}
      </div>
      <div class="extracted-field">
        <strong>Description:</strong> 
        <div class="extracted-text">${data.description ? data.description.substring(0, 500) + (data.description.length > 500 ? '...' : '') : 'Not found'}</div>
      </div>
      ${data.requirements && data.requirements.length > 0 ? `
        <div class="extracted-field">
          <strong>Requirements (${data.requirements.length}):</strong>
          <ul class="extracted-list">
            ${data.requirements.slice(0, 5).map(req => `<li>${req}</li>`).join('')}
            ${data.requirements.length > 5 ? '<li><em>...and more</em></li>' : ''}
          </ul>
        </div>
      ` : ''}
      ${data.responsibilities && data.responsibilities.length > 0 ? `
        <div class="extracted-field">
          <strong>Responsibilities (${data.responsibilities.length}):</strong>
          <ul class="extracted-list">
            ${data.responsibilities.slice(0, 5).map(resp => `<li>${resp}</li>`).join('')}
            ${data.responsibilities.length > 5 ? '<li><em>...and more</em></li>' : ''}
          </ul>
        </div>
      ` : ''}
      <div class="extracted-field">
        <strong>Extracted At:</strong> ${new Date(data.extractedAt).toLocaleString()}
      </div>
    `;
    
    document.getElementById('extractedDataContent').innerHTML = content;
    document.getElementById('actionSection').style.display = 'none';
    document.getElementById('extractedDataSection').style.display = 'block';
  }

  copyCoverLetter() {
    const content = document.getElementById('coverLetterContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
      this.showNotification('Copied to clipboard!', 'success');
    });
  }

  async downloadCoverLetter() {
    const content = document.getElementById('coverLetterContent').innerText;
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'downloadPDF',
        content: content,
        jobData: this.jobData
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
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async updateUsageStats() {
    const stored = await chrome.runtime.sendMessage({
      action: 'getStorageData',
      keys: ['history']
    });
    const history = stored.history || [];
    document.getElementById('usageCount').textContent = `${history.length} letters generated`;
  }

  async forceDetection() {
    const statusSection = document.getElementById('statusSection');
    const actionSection = document.getElementById('actionSection');
    const noJobSection = document.getElementById('noJobSection');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    // Show loading state immediately
    statusIndicator.className = 'status-indicator';
    statusText.textContent = 'Re-detecting job description...';
    statusSection.style.display = 'block';
    actionSection.style.display = 'none';
    noJobSection.style.display = 'none';
    
    try {
      // Add a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await chrome.tabs.sendMessage(this.currentTab.id, { 
        action: 'forceDetection' 
      });
      
      if (response && response.isJobPage) {
        // Update to extracting state
        statusText.textContent = 'Extracting job details...';
        
        const jobDataResponse = await chrome.tabs.sendMessage(this.currentTab.id, { 
          action: 'extractJobData' 
        });
        
        this.jobData = jobDataResponse;
        
        statusIndicator.className = 'status-indicator success';
        statusText.textContent = 'Job description detected!';
        
        document.getElementById('jobTitle').textContent = this.jobData.title || 'Unknown Position';
        document.getElementById('jobCompany').textContent = this.jobData.company || 'Unknown Company';
        
        setTimeout(() => {
          statusSection.style.display = 'none';
          actionSection.style.display = 'block';
        }, 1000);
        
        this.showNotification('Job detected!', 'success');
      } else {
        statusIndicator.className = 'status-indicator error';
        statusText.textContent = 'Still no job description found';
        
        setTimeout(() => {
          statusSection.style.display = 'none';
          noJobSection.style.display = 'block';
        }, 1500);
        
        this.showNotification('Still no job detected on this page', 'error');
      }
    } catch (error) {
      console.error('Force detection error:', error);
      statusIndicator.className = 'status-indicator error';
      statusText.textContent = 'Detection failed - try refreshing';
      
      setTimeout(() => {
        statusSection.style.display = 'none';
        noJobSection.style.display = 'block';
      }, 1500);
      
      this.showNotification('Error during detection: ' + error.message, 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});