class OptionsManager {
  constructor() {
    this.settings = {};
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.setupTabs();
    this.loadHistory();
    this.loadStorageInfo();
    this.checkApiStatus();
  }

  async loadSettings() {
    console.log('Loading settings...');
    
    const stored = await chrome.runtime.sendMessage({
      action: 'getStorageData',
      keys: ['apiKey', 'openaiApiKey', 'claudeApiKey', 'provider', 'personalInfo', 'resume', 'preferences']
    });

    console.log('Received stored data:', stored);

    // Handle legacy API key (migrate to openaiApiKey if needed)
    if (stored.apiKey && !stored.openaiApiKey) {
      stored.openaiApiKey = stored.apiKey;
      stored.provider = 'openai';
    }

    // Set provider and show appropriate config
    const provider = stored.provider || 'openai';
    document.getElementById('provider').value = provider;
    this.showProviderConfig(provider);

    // Set API keys
    if (stored.openaiApiKey) {
      document.getElementById('openaiApiKey').value = stored.openaiApiKey;
    }
    if (stored.claudeApiKey) {
      document.getElementById('claudeApiKey').value = stored.claudeApiKey;
    }

    if (stored.personalInfo) {
      document.getElementById('fullName').value = stored.personalInfo.name || '';
      document.getElementById('email').value = stored.personalInfo.email || '';
      document.getElementById('phone').value = stored.personalInfo.phone || '';
      document.getElementById('linkedin').value = stored.personalInfo.linkedin || '';
      document.getElementById('location').value = stored.personalInfo.location || '';
    }

    if (stored.resume) {
      document.getElementById('resumeText').value = stored.resume;
    }

    if (stored.preferences) {
      // Set model based on provider
      if (provider === 'openai') {
        document.getElementById('openaiModel').value = stored.preferences.model || 'gpt-4o-mini';
      } else {
        document.getElementById('claudeModel').value = stored.preferences.model || 'claude-3-5-sonnet-20241022';
      }
      
      document.getElementById('tone').value = stored.preferences.tone || 'professional';
      document.getElementById('length').value = stored.preferences.length || 'medium';
      document.getElementById('includeMetrics').checked = stored.preferences.includeMetrics !== false;
      document.getElementById('includeKeywords').checked = stored.preferences.includeKeywords !== false;
      document.getElementById('includeCallToAction').checked = stored.preferences.includeCallToAction !== false;
      document.getElementById('customInstructions').value = stored.preferences.customInstructions || '';
    }
  }

  showProviderConfig(provider) {
    const openaiConfig = document.getElementById('openaiConfig');
    const claudeConfig = document.getElementById('claudeConfig');
    
    if (provider === 'claude') {
      openaiConfig.style.display = 'none';
      claudeConfig.style.display = 'block';
    } else {
      openaiConfig.style.display = 'block';
      claudeConfig.style.display = 'none';
    }
  }

  bindEvents() {
    document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
    
    // Provider selection
    document.getElementById('provider').addEventListener('change', (e) => {
      this.showProviderConfig(e.target.value);
    });
    
    // API key visibility toggles
    document.getElementById('toggleOpenAiApiKey').addEventListener('click', () => {
      const input = document.getElementById('openaiApiKey');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    document.getElementById('toggleClaudeApiKey').addEventListener('click', () => {
      const input = document.getElementById('claudeApiKey');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    document.getElementById('testOpenaiBtn').addEventListener('click', () => this.testApiConnection('openai'));
    document.getElementById('testClaudeBtn').addEventListener('click', () => this.testApiConnection('claude'));

    document.getElementById('uploadBtn').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileUpload(e.target.files[0]);
    });

    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) this.handleFileUpload(file);
    });

    document.getElementById('clearAllHistoryBtn').addEventListener('click', () => {
      this.clearHistory();
    });

    document.getElementById('exportHistoryBtn').addEventListener('click', () => {
      this.exportHistory();
    });
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabId}Tab`).classList.add('active');
      });
    });
  }

  async saveSettings() {
    const saveBtn = document.getElementById('saveBtn');
    const saveStatus = document.getElementById('saveStatus');
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      const provider = document.getElementById('provider').value;
      const settings = {
        provider: provider,
        openaiApiKey: document.getElementById('openaiApiKey').value.trim(),
        claudeApiKey: document.getElementById('claudeApiKey').value.trim(),
        personalInfo: {
          name: document.getElementById('fullName').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          linkedin: document.getElementById('linkedin').value.trim(),
          location: document.getElementById('location').value.trim()
        },
        resume: document.getElementById('resumeText').value.trim(),
        preferences: {
          model: provider === 'claude' 
            ? document.getElementById('claudeModel').value 
            : document.getElementById('openaiModel').value,
          provider: provider,
          tone: document.getElementById('tone').value,
          length: document.getElementById('length').value,
          includeMetrics: document.getElementById('includeMetrics').checked,
          includeKeywords: document.getElementById('includeKeywords').checked,
          includeCallToAction: document.getElementById('includeCallToAction').checked,
          customInstructions: document.getElementById('customInstructions').value.trim()
        }
      };

      // Keep legacy apiKey field for backward compatibility
      settings.apiKey = provider === 'claude' ? settings.claudeApiKey : settings.openaiApiKey;

      console.log('Saving settings:', settings);

      const result = await chrome.runtime.sendMessage({
        action: 'setStorageData',
        data: settings
      });
      
      console.log('Save result:', result);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to save settings');
      }
      
      saveStatus.textContent = 'Settings saved successfully!';
      saveStatus.className = 'save-status success';
      this.showNotification('Settings saved successfully!', 'success');
      
      this.checkApiStatus();
    } catch (error) {
      saveStatus.textContent = 'Error saving settings';
      saveStatus.className = 'save-status error';
      this.showNotification('Error saving settings: ' + error.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Settings';
      
      setTimeout(() => {
        saveStatus.textContent = '';
        saveStatus.className = 'save-status';
      }, 3000);
    }
  }

  async testApiConnection(provider) {
    // If no provider specified, use the currently selected one
    if (!provider) {
      provider = document.getElementById('provider').value;
    }
    
    const apiKey = provider === 'claude' 
      ? document.getElementById('claudeApiKey').value.trim()
      : document.getElementById('openaiApiKey').value.trim();
    const testBtn = document.getElementById(provider === 'claude' ? 'testClaudeBtn' : 'testOpenaiBtn');
    const statusDisplay = document.getElementById(provider === 'claude' ? 'claudeStatusDisplay' : 'openaiStatusDisplay');
    const statusDot = statusDisplay.querySelector('.status-dot');
    const statusText = statusDisplay.querySelector('.status-text');

    if (!apiKey) {
      this.showNotification(`Please enter a ${provider === 'claude' ? 'Claude' : 'OpenAI'} API key first`, 'error');
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    statusText.textContent = 'Testing connection...';
    statusDot.className = 'status-dot testing';

    try {
      let response;
      
      if (provider === 'claude') {
        // Test Claude API
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }]
          })
        });
      } else {
        // Test OpenAI API
        response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
      }

      if (response.ok) {
        statusDot.className = 'status-dot success';
        statusText.textContent = 'Connected successfully';
        this.showNotification(`${provider === 'claude' ? 'Claude' : 'OpenAI'} API connection successful!`, 'success');
      } else {
        const error = await response.json();
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Connection failed';
        this.showNotification('API connection failed: ' + (error.error?.message || 'Invalid API key'), 'error');
      }
    } catch (error) {
      statusDot.className = 'status-dot error';
      statusText.textContent = 'Connection error';
      this.showNotification('Connection error: ' + error.message, 'error');
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test Connection';
    }
  }

  async checkApiStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'checkAuth' });
      
      // Update OpenAI status
      const openaiStatusDisplay = document.getElementById('openaiStatusDisplay');
      const openaiStatusDot = openaiStatusDisplay.querySelector('.status-dot');
      const openaiStatusText = openaiStatusDisplay.querySelector('.status-text');
      
      if (response.hasOpenAI) {
        openaiStatusDot.className = 'status-dot configured';
        openaiStatusText.textContent = 'OpenAI API key configured';
      } else {
        openaiStatusDot.className = 'status-dot';
        openaiStatusText.textContent = 'Not configured';
      }
      
      // Update Claude status
      const claudeStatusDisplay = document.getElementById('claudeStatusDisplay');
      const claudeStatusDot = claudeStatusDisplay.querySelector('.status-dot');
      const claudeStatusText = claudeStatusDisplay.querySelector('.status-text');
      
      if (response.hasClaude) {
        claudeStatusDot.className = 'status-dot configured';
        claudeStatusText.textContent = 'Claude API key configured';
      } else {
        claudeStatusDot.className = 'status-dot';
        claudeStatusText.textContent = 'Not configured';
      }
    } catch (error) {
      // Reset both to not configured on error
      ['openaiStatusDisplay', 'claudeStatusDisplay'].forEach(displayId => {
        const statusDisplay = document.getElementById(displayId);
        const statusDot = statusDisplay.querySelector('.status-dot');
        const statusText = statusDisplay.querySelector('.status-text');
        statusDot.className = 'status-dot';
        statusText.textContent = 'Not configured';
      });
    }
  }

  async handleFileUpload(file) {
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      this.showNotification('Unsupported file type. Please upload TXT, PDF, DOC, or DOCX files.', 'error');
      return;
    }

    const reader = new FileReader();
    
    if (file.type === 'text/plain') {
      reader.onload = (e) => {
        document.getElementById('resumeText').value = e.target.result;
        this.showNotification('Resume uploaded successfully!', 'success');
      };
      reader.readAsText(file);
    } else {
      this.showNotification('For best results, please use plain text (.txt) files or paste your resume directly.', 'info');
    }
  }

  async loadHistory() {
    const stored = await chrome.runtime.sendMessage({
      action: 'getStorageData',
      keys: ['history']
    });
    const history = stored.history || [];
    const container = document.getElementById('historyContainer');
    
    if (history.length === 0) {
      container.innerHTML = '<p class="empty-message">No cover letters generated yet</p>';
      return;
    }

    container.innerHTML = history.map(item => `
      <div class="history-item">
        <div class="history-header">
          <h4>${item.jobTitle}</h4>
          <time>${new Date(item.generatedAt).toLocaleString()}</time>
        </div>
        <p class="company">${item.company}</p>
        <div class="history-preview">${item.coverLetter.substring(0, 150)}...</div>
        <div class="history-actions">
          <button class="view-btn" data-id="${item.id}">View Full</button>
          <button class="copy-btn" data-id="${item.id}">Copy</button>
          <button class="delete-btn" data-id="${item.id}">Delete</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = history.find(h => h.id === e.target.dataset.id);
        if (item) this.showFullCoverLetter(item);
      });
    });

    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = history.find(h => h.id === e.target.dataset.id);
        if (item) {
          navigator.clipboard.writeText(item.coverLetter);
          this.showNotification('Copied to clipboard!', 'success');
        }
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        
        // Confirm deletion
        const item = history.find(h => h.id === id);
        if (!item) return;
        
        const confirmed = confirm(`Delete cover letter for "${item.jobTitle}" at "${item.company}"?`);
        if (!confirmed) return;
        
        try {
          // Filter out the item to delete
          const newHistory = history.filter(h => h.id !== id);
          
          // Use the proper storage service instead of direct chrome.storage
          const result = await chrome.runtime.sendMessage({
            action: 'setStorageData',
            data: { history: newHistory }
          });
          
          if (result && result.success) {
            await this.loadHistory();
            this.showNotification('Cover letter deleted successfully', 'success');
          } else {
            throw new Error(result?.error || 'Failed to delete');
          }
        } catch (error) {
          console.error('Error deleting history item:', error);
          this.showNotification('Failed to delete cover letter', 'error');
        }
      });
    });
  }

  showFullCoverLetter(item) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${item.jobTitle} - ${item.company}</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <pre>${item.coverLetter}</pre>
        </div>
        <div class="modal-footer">
          <button class="copy-modal-btn">Copy</button>
          <button class="close-modal-btn">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.copy-modal-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(item.coverLetter);
      this.showNotification('Copied to clipboard!', 'success');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  async clearHistory() {
    if (confirm('Are you sure you want to clear all cover letter history? This cannot be undone.')) {
      await chrome.runtime.sendMessage({
        action: 'setStorageData',
        data: { history: [] }
      });
      await this.loadHistory();
      await this.loadStorageInfo();
      this.showNotification('History cleared successfully', 'success');
    }
  }

  async loadStorageInfo() {
    const container = document.getElementById('storageInfo');
    
    try {
      const usage = await chrome.runtime.sendMessage({
        action: 'getStorageUsage'
      });
      
      if (!usage) {
        container.innerHTML = '<p class="error">Unable to load storage information</p>';
        return;
      }
      
      const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      container.innerHTML = `
        <div class="storage-item">
          <h4>Sync Storage (Settings & Preferences)</h4>
          <div class="storage-bar">
            <div class="storage-progress" style="width: ${Math.min(usage.sync.percentage, 100)}%"></div>
          </div>
          <p>${formatBytes(usage.sync.used)} / ${formatBytes(usage.sync.quota)} (${usage.sync.percentage.toFixed(1)}%)</p>
        </div>
        
        <div class="storage-item">
          <h4>Local Storage (Resume & History)</h4>
          <div class="storage-bar">
            <div class="storage-progress" style="width: ${Math.min(usage.local.percentage, 100)}%"></div>
          </div>
          <p>${formatBytes(usage.local.used)} / ${formatBytes(usage.local.quota)} (${usage.local.percentage.toFixed(1)}%)</p>
        </div>
        
        ${usage.sync.percentage > 80 || usage.local.percentage > 80 ? 
          '<div class="storage-warning">⚠️ Storage is getting full. Consider clearing old data.</div>' : ''}
      `;
      
    } catch (error) {
      console.error('Error loading storage info:', error);
      container.innerHTML = '<p class="error">Error loading storage information</p>';
    }
  }

  async exportHistory() {
    const { history = [] } = await chrome.storage.sync.get(['history']);
    
    if (history.length === 0) {
      this.showNotification('No history to export', 'info');
      return;
    }

    const exportData = JSON.stringify(history, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letters_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showNotification('History exported successfully', 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});