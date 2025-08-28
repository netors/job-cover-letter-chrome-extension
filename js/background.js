// ===== AI SERVICE VERSION 2.0 - FRESH CACHE =====
// Version: Updated with dual provider routing
// Date: 2024-12-18
class AIService {
  async generateCoverLetter(jobData, settings) {
    console.log('🚀🚀🚀 NEW AISERVICE VERSION 2.0 CALLED 🚀🚀🚀');
    console.log('📅 VERSION: 2024-12-18 Fresh Cache');
    
    const provider = settings?.provider || settings?.preferences?.provider || 'openai';
    
    console.log('🔍 AIService routing debug:', {
      settingsProvider: settings?.provider,
      preferencesProvider: settings?.preferences?.provider,
      finalProvider: provider,
      willCallClaude: provider === 'claude'
    });
    
    if (provider === 'claude') {
      console.log('🎯 Routing to Claude service');
      return await this.generateWithClaude(jobData, settings);
    } else {
      console.log('🎯 Routing to OpenAI service');
      return await this.generateWithOpenAI(jobData, settings);
    }
  }

  async generateWithClaude(jobData, settings) {
    console.log('🚀 NEW VERSION: Claude generateWithClaude called');
    console.log('📋 Settings check:', {
      hasClaudeApiKey: !!settings?.claudeApiKey,
      apiKeyPrefix: settings?.claudeApiKey ? settings.claudeApiKey.substring(0, 12) + '...' : 'none',
      hasResume: !!settings?.resume,
      hasPersonalInfo: !!settings?.personalInfo,
      hasPreferences: !!settings?.preferences,
      model: settings?.preferences?.model || 'default'
    });
    
    const { claudeApiKey, resume, personalInfo, preferences } = settings;
    
    if (!claudeApiKey) {
      console.error('❌ Claude: No API key provided');
      throw new Error('Claude API key is not configured');
    }

    console.log('🔨 Building prompts...');
    const systemPrompt = this.buildSystemPrompt(preferences);
    const userPrompt = this.buildUserPrompt(jobData, resume, personalInfo);
    
    console.log('📏 Prompt lengths:', {
      system: systemPrompt.length,
      user: userPrompt.length,
      total: systemPrompt.length + userPrompt.length
    });
    
    console.log('🔍 DEBUG: User prompt contains date:', userPrompt.includes(new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })));
    console.log('🔍 DEBUG: System prompt excerpt (last 200 chars):', systemPrompt.slice(-200));

    const requestBody = {
      model: preferences?.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    };
    
    console.log('🌐 Making Claude API request...');
    console.log('🔗 URL: https://api.anthropic.com/v1/messages');
    console.log('📦 Request body:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      max_tokens: requestBody.max_tokens,
      hasSystemPrompt: !!requestBody.system,
      systemLength: systemPrompt.length
    });

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Claude response status:', response.status);
      console.log('📡 Claude response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Claude API error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid Claude API key. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('Claude API rate limit exceeded. Please try again later.');
        } else if (response.status === 400) {
          throw new Error('Claude API request error. Please check your input.');
        }
        throw error;
      }

      const data = await response.json();
      console.log('✅ Claude response received');
      console.log('📊 Response data:', {
        hasContent: !!data.content,
        contentLength: data.content?.[0]?.text?.length || 0,
        usage: data.usage,
        model: data.model
      });
      
      if (!data.content || data.content.length === 0) {
        throw new Error('No content in Claude response');
      }
      
      let content = data.content[0].text;
      console.log('✅ Cover letter generated, length:', content ? content.length : 0);
      
      // Post-process to clean up any remaining placeholders
      content = this.cleanupPlaceholders(content, personalInfo);
      console.log('🧹 Content cleaned up');
      
      return content;
    } catch (error) {
      console.error('❌ Claude API Error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async generateWithOpenAI(jobData, settings) {
    console.log('🚀 NEW VERSION: OpenAI generateWithOpenAI called');
    
    const openaiApiKey = settings?.openaiApiKey || settings?.apiKey; // Support legacy
    const { resume, personalInfo, preferences } = settings;
    
    console.log('📋 Settings check:', {
      hasOpenAIKey: !!openaiApiKey,
      apiKeyPrefix: openaiApiKey ? openaiApiKey.substring(0, 8) + '...' : 'none',
      hasResume: !!settings?.resume,
      hasPersonalInfo: !!settings?.personalInfo,
      hasPreferences: !!settings?.preferences,
      model: settings?.preferences?.model || 'default'
    });
    
    if (!openaiApiKey) {
      console.error('❌ OpenAI: No API key provided');
      throw new Error('OpenAI API key is not configured');
    }

    console.log('🔨 Building prompts...');
    const systemPrompt = this.buildSystemPrompt(preferences);
    const userPrompt = this.buildUserPrompt(jobData, resume, personalInfo);
    
    console.log('📏 Prompt lengths:', {
      system: systemPrompt.length,
      user: userPrompt.length,
      total: systemPrompt.length + userPrompt.length
    });
    
    console.log('🔍 DEBUG: User prompt contains date:', userPrompt.includes(new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })));
    console.log('🔍 DEBUG: System prompt excerpt (last 200 chars):', systemPrompt.slice(-200));

    const requestBody = {
      model: preferences?.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    };
    
    console.log('🌐 Making OpenAI API request...');
    console.log('🔗 URL: https://api.openai.com/v1/chat/completions');
    console.log('📦 Request body:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 OpenAI response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API error response:', errorText);
        
        let error;
        try {
          const errorData = JSON.parse(errorText);
          error = new Error(errorData.error?.message || 'API request failed');
        } catch (parseError) {
          error = new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        throw error;
      }

      const data = await response.json();
      console.log('✅ OpenAI response received');
      console.log('📊 Response data:', {
        hasChoices: !!data.choices,
        choicesCount: data.choices?.length || 0,
        usage: data.usage,
        model: data.model
      });
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices from OpenAI');
      }
      
      let content = data.choices[0].message.content;
      console.log('✅ Cover letter generated, length:', content ? content.length : 0);
      
      // Post-process to clean up any remaining placeholders
      content = this.cleanupPlaceholders(content, personalInfo);
      console.log('🧹 Content cleaned up');
      
      return content;
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  buildSystemPrompt(preferences) {
    const tone = preferences?.tone || 'professional';
    const toneInstructions = {
      professional: 'Use a professional, formal tone that demonstrates expertise and competence.',
      enthusiastic: 'Use an enthusiastic, energetic tone that shows genuine excitement for the role.',
      concise: 'Be direct and concise, focusing on key qualifications without unnecessary elaboration.',
      friendly: 'Use a warm, friendly tone while maintaining professionalism.'
    };

    return `You are an expert cover letter writer with extensive experience in crafting compelling, personalized cover letters that get candidates noticed. 

Your task is to generate a highly personalized cover letter that:
1. Directly addresses the specific requirements and responsibilities mentioned in the job description
2. Highlights relevant experience and skills from the candidate's background
3. Demonstrates genuine interest in the company and role
4. Uses keywords from the job description naturally
5. Follows a clear structure: opening hook, body paragraphs with specific examples, and strong closing
6. ${toneInstructions[tone]}

Important guidelines:
- Keep the cover letter between 250-400 words
- Use specific examples and achievements rather than generic statements
- Show how the candidate's experience directly relates to the job requirements
- Include metrics and quantifiable results when possible
- Ensure the letter feels authentic and not AI-generated
- Address the hiring manager professionally (use "Dear Hiring Manager" if name unknown)
- End with a call to action expressing interest in discussing the opportunity further
- CRITICAL: Always use the actual date provided by the user, never use placeholder text like [Date]
- Format the date at the top of the letter in the format provided (e.g., "December 18, 2024")
- NEVER EVER write [Date] - always use the real date given in the user prompt
- The date should be the very first thing in the cover letter`;
  }

  buildUserPrompt(jobData, resume, personalInfo) {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    let prompt = `CRITICAL: Start the cover letter with this EXACT date (not [Date]): ${today}\n\n`;
    
    prompt += `Generate a cover letter for the following job opportunity:\n\n`;
    
    prompt += `**Today's Date:** ${today}\n`;
    prompt += `**Job Title:** ${jobData.title}\n`;
    prompt += `**Company:** ${jobData.company}\n\n`;
    
    prompt += `**Job Description:**\n${jobData.description}\n\n`;
    
    if (jobData.requirements?.length > 0) {
      prompt += `**Key Requirements:**\n`;
      jobData.requirements.forEach(req => {
        prompt += `- ${req}\n`;
      });
      prompt += '\n';
    }
    
    if (jobData.responsibilities?.length > 0) {
      prompt += `**Key Responsibilities:**\n`;
      jobData.responsibilities.forEach(resp => {
        prompt += `- ${resp}\n`;
      });
      prompt += '\n';
    }
    
    if (personalInfo) {
      prompt += `**Candidate Information:**\n`;
      prompt += `Name: ${personalInfo.name || '[Your Name]'}\n`;
      prompt += `Email: ${personalInfo.email || '[Your Email]'}\n`;
      prompt += `Phone: ${personalInfo.phone || '[Your Phone]'}\n`;
      prompt += `LinkedIn: ${personalInfo.linkedin || 'Not provided'}\n`;
      if (personalInfo.location) {
        prompt += `Location: ${personalInfo.location}\n`;
      }
      prompt += '\n';
    }
    
    if (resume) {
      prompt += `**Candidate's Resume/Background:**\n${resume}\n\n`;
    }
    
    prompt += `Please generate a compelling cover letter that directly addresses this specific position and company, incorporating relevant details from the candidate's background. 

CRITICAL INSTRUCTIONS FOR THE DATE AND CONTACT INFO: 
- The cover letter MUST begin with the exact date: ${today}
- NEVER write [Date] or any placeholder text for the date
- The first line of your cover letter should be exactly: ${today}
- Use proper business letter format
- Include the candidate's contact information in the header
- For LinkedIn: If LinkedIn is "Not provided", do NOT include any LinkedIn reference in the cover letter
- NEVER use placeholder text like [LinkedIn Profile URL] - either use the actual LinkedIn URL or omit it
- Example of CORRECT start: "${today}"
- Example of WRONG start: "[Date]" or "Date:"
- TODAY'S ACTUAL DATE TO USE: ${today}
- Use this EXACT text: ${today}`;
    
    return prompt;
  }

  cleanupPlaceholders(content, personalInfo) {
    if (!content) return content;
    
    // Replace common LinkedIn placeholders
    const linkedinPlaceholders = [
      '[LinkedIn Profile URL]',
      '[LinkedIn URL]', 
      '[Your LinkedIn Profile]',
      '[LinkedIn Profile]',
      'linkedin.com/in/yourprofile',
      'linkedin.com/in/[yourname]'
    ];
    
    linkedinPlaceholders.forEach(placeholder => {
      if (personalInfo?.linkedin) {
        content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), personalInfo.linkedin);
      } else {
        // Remove the placeholder and any surrounding text
        content = content.replace(new RegExp(`\\s*${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'gi'), '');
      }
    });
    
    // Clean up other common placeholders
    const otherPlaceholders = {
      '[Your Name]': personalInfo?.name || '[Your Name]',
      '[Your Email]': personalInfo?.email || '[Your Email]',
      '[Your Phone]': personalInfo?.phone || '[Your Phone]',
      '[Date]': new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    };
    
    Object.entries(otherPlaceholders).forEach(([placeholder, replacement]) => {
      content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
    });
    
    return content;
  }
}

class StorageService {
  constructor() {
    this.SYNC_QUOTA_BYTES_PER_ITEM = 8192;
    // For simplicity and reliability, store everything in local storage
    // This ensures persistence and avoids quota issues
    this.USE_LOCAL_STORAGE_ONLY = true;
    this.LOCAL_FALLBACK_ITEMS = ['resume', 'history', 'apiKey', 'personalInfo', 'preferences'];
  }

  async get(keys) {
    const result = {};
    const keysArray = Array.isArray(keys) ? keys : [keys];
    
    console.log('StorageService.get() called with keys:', keysArray);
    
    for (const key of keysArray) {
      try {
        let found = false;
        
        // If using local storage only, or for specific items, try local storage first
        if (this.USE_LOCAL_STORAGE_ONLY || this.LOCAL_FALLBACK_ITEMS.includes(key)) {
          console.log(`Checking local storage for ${key}`);
          const localResult = await this._getFromLocal(key);
          if (localResult[key] !== undefined && localResult[key] !== null) {
            result[key] = localResult[key];
            console.log(`Found ${key} in local storage:`, typeof localResult[key], localResult[key] ? 'has data' : 'empty');
            found = true;
          } else {
            console.log(`${key} not found in local storage`);
          }
        }
        
        if (!found && !this.USE_LOCAL_STORAGE_ONLY) {
          console.log(`Checking sync storage for ${key}`);
          // Try sync storage
          const syncResult = await this._getFromSync([key]);
          if (syncResult[key] !== undefined && syncResult[key] !== null) {
            result[key] = syncResult[key];
            console.log(`Found ${key} in sync storage:`, typeof syncResult[key], syncResult[key] ? 'has data' : 'empty');
          } else {
            console.log(`${key} not found in sync storage`);
          }
        }
      } catch (error) {
        console.warn(`Error getting ${key} from storage:`, error);
      }
    }
    
    console.log('StorageService.get() returning:', Object.keys(result));
    return result;
  }

  async set(items) {
    const results = {};
    
    console.log('StorageService.set() called with items:', Object.keys(items));
    
    for (const [key, value] of Object.entries(items)) {
      try {
        if (value === undefined || value === null) {
          console.warn(`Skipping ${key} - value is ${value}`);
          continue;
        }
        
        const serializedValue = JSON.stringify(value);
        const sizeInBytes = new Blob([serializedValue]).size;
        
        console.log(`Storage item ${key}: ${sizeInBytes} bytes, type: ${typeof value}`);
        
        let success = false;
        
        if (this.USE_LOCAL_STORAGE_ONLY || sizeInBytes > this.SYNC_QUOTA_BYTES_PER_ITEM || this.LOCAL_FALLBACK_ITEMS.includes(key)) {
          // Use local storage (default strategy for reliability)
          console.log(`Using local storage for ${key} (${sizeInBytes} bytes)`);
          try {
            await this._setToLocal({ [key]: value });
            console.log(`✅ Successfully saved ${key} to local storage`);
            success = true;
          } catch (localError) {
            console.error(`❌ Failed to save ${key} to local storage:`, localError);
          }
        } 
        
        if (!success && !this.USE_LOCAL_STORAGE_ONLY) {
          // Try sync storage as fallback (only if not using local-only mode)
          console.log(`Fallback: trying sync storage for ${key} (${sizeInBytes} bytes)`);
          try {
            await this._setToSync({ [key]: value });
            console.log(`✅ Successfully saved ${key} to sync storage`);
            success = true;
          } catch (syncError) {
            console.error(`❌ Failed to save ${key} to sync storage:`, syncError);
          }
        }
        
        results[key] = success;
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
        results[key] = false;
      }
    }
    
    console.log('StorageService.set() results:', results);
    return results;
  }

  async remove(keys) {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    
    // Remove from both sync and local storage
    await Promise.all([
      this._removeFromSync(keysArray),
      this._removeFromLocal(keysArray)
    ]);
  }

  async _getFromSync(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, resolve);
    });
  }

  async _setToSync(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  async _removeFromSync(keys) {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(keys, resolve);
    });
  }

  async _getFromLocal(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], resolve);
    });
  }

  async _setToLocal(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  async _removeFromLocal(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys, resolve);
    });
  }

  async getStorageUsage() {
    try {
      const syncUsage = await new Promise((resolve) => {
        chrome.storage.sync.getBytesInUse(null, resolve);
      });
      
      const localUsage = await new Promise((resolve) => {
        chrome.storage.local.getBytesInUse(null, resolve);
      });
      
      return {
        sync: {
          used: syncUsage,
          quota: chrome.storage.sync.QUOTA_BYTES,
          percentage: (syncUsage / chrome.storage.sync.QUOTA_BYTES) * 100
        },
        local: {
          used: localUsage,
          quota: chrome.storage.local.QUOTA_BYTES,
          percentage: (localUsage / chrome.storage.local.QUOTA_BYTES) * 100
        }
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return null;
    }
  }
}

class PDFGenerator {
  async generatePDF(content, jobData, personalInfo = {}) {
    console.log('📄 Generating PDF for cover letter...');
    
    try {
      // Create a more professional PDF-ready HTML content
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Cover Letter</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.6;
              margin: 1in;
              color: #000;
              font-size: 12pt;
              max-width: 8.5in;
            }
            .header {
              text-align: right;
              margin-bottom: 2em;
            }
            .contact-info {
              line-height: 1.3;
            }
            .date {
              margin: 2em 0;
            }
            .content {
              text-align: left;
              white-space: pre-wrap;
              line-height: 1.8;
            }
            .footer {
              margin-top: 2em;
              font-style: italic;
              font-size: 10pt;
              color: #666;
              text-align: center;
            }
            @media print {
              body { margin: 0.75in; }
              .footer { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="contact-info">
              ${personalInfo.name ? `<div><strong>${personalInfo.name}</strong></div>` : ''}
              ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
              ${personalInfo.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
              ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
            </div>
          </div>
          
          <div class="date">${today}</div>
          
          <div class="content">${content}</div>
          
        </body>
        </html>
      `;

      // Create a clean filename 
      const companyName = (jobData.company || 'Unknown_Company').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      const jobTitle = (jobData.title || 'Unknown_Position').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const filename = `Cover_Letter_${companyName}_${jobTitle}_${timestamp}.pdf`;
      
      console.log('📥 Creating PDF:', filename);
      
      // Open the HTML in a new tab that will automatically prompt to save as PDF
      chrome.tabs.create({
        url: 'data:text/html;charset=utf-8,' + encodeURIComponent(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Cover Letter - Print to PDF</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                line-height: 1.6;
                margin: 1in;
                color: #000;
                font-size: 12pt;
                max-width: 8.5in;
              }
              .header {
                text-align: right;
                margin-bottom: 2em;
              }
              .contact-info {
                line-height: 1.3;
              }
              .date {
                margin: 2em 0;
              }
              .content {
                text-align: left;
                white-space: pre-wrap;
                line-height: 1.8;
              }
              .print-instructions {
                background: #f0f9ff;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
              }
              .print-button {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                margin: 10px;
              }
              .print-button:hover {
                background: #2563eb;
              }
              @media print {
                .print-instructions { display: none !important; }
                body { margin: 0.75in; }
              }
            </style>
          </head>
          <body>
            <div class="print-instructions">
              <h2>🎉 Your Cover Letter is Ready!</h2>
              <p><strong>To save as PDF:</strong> Click the "Print to PDF" button below or press <kbd>Ctrl+P</kbd> (or <kbd>⌘+P</kbd> on Mac)</p>
              <p>In the print dialog, select "Save as PDF" as your destination.</p>
              <button class="print-button" onclick="window.print()">📄 Print to PDF</button>
              <button class="print-button" onclick="window.close()">❌ Close</button>
            </div>
            
            <div class="header">
              <div class="contact-info">
                ${personalInfo.name ? `<div><strong>${personalInfo.name}</strong></div>` : ''}
                ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
                ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
                ${personalInfo.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
                ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
              </div>
            </div>
            
            <div class="date">${today}</div>
            
            <div class="content">${content}</div>
            
            <script>
              // Auto-focus for immediate printing option
              document.addEventListener('DOMContentLoaded', function() {
                // Optional: Auto-open print dialog after a short delay
                // setTimeout(() => window.print(), 1000);
              });
            </script>
          </body>
          </html>
        `),
        active: true
      }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error('❌ Tab creation failed:', chrome.runtime.lastError);
          throw new Error(`Tab creation failed: ${chrome.runtime.lastError.message}`);
        } else {
          console.log('✅ PDF print tab opened:', tab.id);
        }
      });
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      throw error;
    }
  }
}

const aiService = new AIService();
const storageService = new StorageService();
const pdfGenerator = new PDFGenerator();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.action);
  
  try {
    if (request.action === 'generateCoverLetter') {
      handleGenerateCoverLetter(request, sendResponse);
      return true; // Keep message channel open for async response
    } else if (request.action === 'openOptions') {
      chrome.runtime.openOptionsPage();
      sendResponse({ success: true });
    } else if (request.action === 'downloadPDF') {
      handleDownloadPDF(request, sendResponse);
      return true; // Keep message channel open for async response
    } else if (request.action === 'checkAuth') {
      handleCheckAuth(sendResponse);
      return true; // Keep message channel open for async response
    } else if (request.action === 'getStorageData') {
      handleGetStorageData(request, sendResponse);
      return true; // Keep message channel open for async response
    } else if (request.action === 'setStorageData') {
      handleSetStorageData(request, sendResponse);
      return true; // Keep message channel open for async response
    } else if (request.action === 'getStorageUsage') {
      handleGetStorageUsage(sendResponse);
      return true; // Keep message channel open for async response
    } else {
      console.warn('Unknown action:', request.action);
      sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return false; // Default: don't keep message channel open
});

async function handleGenerateCoverLetter(request, sendResponse) {
  console.log('🔄 handleGenerateCoverLetter called');
  console.log('📥 Request data:', {
    hasJobData: !!request.jobData,
    hasSettings: !!request.settings,
    jobDataKeys: request.jobData ? Object.keys(request.jobData) : [],
    settingsKeys: request.settings ? Object.keys(request.settings) : []
  });

  // Wrap in Promise to ensure proper error handling
  const handleAsync = async () => {
    try {
      // Use settings from request if available, otherwise get from storage
      let settings = request.settings;
      
      if (!settings) {
        console.log('📖 No settings in request, retrieving from storage...');
        settings = await storageService.get(['apiKey', 'resume', 'personalInfo', 'preferences']);
        console.log('📋 Settings from storage:', {
          hasApiKey: !!settings.apiKey,
          hasResume: !!settings.resume,
          hasPersonalInfo: !!settings.personalInfo,
          hasPreferences: !!settings.preferences
        });
      } else {
        console.log('✅ Using settings from request');
      }
      
      // Check for appropriate API key based on provider
      const provider = settings.provider || settings.preferences?.provider || 'openai';
      let hasValidApiKey = false;
      let errorMessage = 'Please configure your API key in settings';
      
      console.log('🔍 Background handler provider debug:', {
        settingsProvider: settings.provider,
        preferencesProvider: settings.preferences?.provider,
        finalProvider: provider,
        settingsKeys: Object.keys(settings)
      });
      
      if (provider === 'claude') {
        hasValidApiKey = !!settings.claudeApiKey;
        errorMessage = 'Please configure your Claude API key in settings';
      } else {
        hasValidApiKey = !!(settings.openaiApiKey || settings.apiKey); // Support legacy
        errorMessage = 'Please configure your OpenAI API key in settings';
      }
      
      if (!hasValidApiKey) {
        console.error('❌ No API key found for provider:', provider);
        sendResponse({ success: false, error: errorMessage });
        return;
      }
      
      console.log(`🤖 Calling ${provider === 'claude' ? 'Claude' : 'OpenAI'} service...`);
      console.log('📝 Job data:', request.jobData);
      
      const coverLetter = await aiService.generateCoverLetter(request.jobData, settings);
      console.log('✅ Cover letter generated, length:', coverLetter ? coverLetter.length : 0);
      
      // Save to history
      console.log('💾 Saving to history...');
      const historyData = await storageService.get(['history']);
      const history = historyData.history || [];
      
      // Get provider and model info for history (reuse existing provider variable)
      const model = settings.preferences?.model || (provider === 'claude' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o-mini');
      
      history.unshift({
        id: Date.now().toString(),
        jobTitle: request.jobData.title,
        company: request.jobData.company,
        coverLetter: coverLetter,
        generatedAt: new Date().toISOString(),
        url: request.jobData.url,
        provider: provider,
        model: model
      });
      
      const trimmedHistory = history.slice(0, 50);
      await storageService.set({ history: trimmedHistory });
      console.log('✅ Saved to history');
      
      sendResponse({ success: true, coverLetter: coverLetter });
      console.log('✅ Response sent successfully');
      
    } catch (error) {
      console.error('❌ Error generating cover letter:', error);
      console.error('❌ Error stack:', error.stack);
      sendResponse({ success: false, error: error.message });
    }
  };

  // Execute the async handler with additional error protection
  handleAsync().catch((error) => {
    console.error('❌ Unhandled promise rejection in handleGenerateCoverLetter:', error);
    sendResponse({ success: false, error: 'Unexpected error occurred' });
  });
}

async function handleCheckAuth(sendResponse) {
  try {
    const settings = await storageService.get(['apiKey', 'openaiApiKey', 'claudeApiKey', 'provider']);
    const provider = settings.provider || 'openai';
    
    let hasApiKey = false;
    if (provider === 'claude') {
      hasApiKey = !!settings.claudeApiKey;
    } else {
      hasApiKey = !!settings.openaiApiKey || !!settings.apiKey; // Support legacy
    }
    
    sendResponse({ 
      hasApiKey, 
      provider,
      hasOpenAI: !!(settings.openaiApiKey || settings.apiKey),
      hasClaude: !!settings.claudeApiKey
    });
  } catch (error) {
    sendResponse({ hasApiKey: false });
  }
}

async function handleGetStorageData(request, sendResponse) {
  try {
    const data = await storageService.get(request.keys);
    sendResponse(data);
  } catch (error) {
    console.error('Error getting storage data:', error);
    sendResponse({});
  }
}

async function handleSetStorageData(request, sendResponse) {
  try {
    const results = await storageService.set(request.data);
    sendResponse({ success: true, results });
  } catch (error) {
    console.error('Error setting storage data:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetStorageUsage(sendResponse) {
  try {
    const usage = await storageService.getStorageUsage();
    sendResponse(usage);
  } catch (error) {
    console.error('Error getting storage usage:', error);
    sendResponse(null);
  }
}

async function handleDownloadPDF(request, sendResponse) {
  try {
    console.log('📄 Handling PDF download request');
    
    // Get personal info for the PDF header
    const settings = await storageService.get(['personalInfo']);
    const personalInfo = settings.personalInfo || {};
    
    await pdfGenerator.generatePDF(request.content, request.jobData, personalInfo);
    sendResponse({ success: true });
  } catch (error) {
    console.error('❌ Error handling PDF download:', error);
    sendResponse({ success: false, error: error.message });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Cover Letter Generator installed');
  
  chrome.storage.sync.get(['apiKey'], (result) => {
    if (!result.apiKey) {
      chrome.runtime.openOptionsPage();
    }
  });
});

// ===== MANUAL SCRIPT INJECTION ON USER CLICK =====
// Chrome Web Store compliance: Only inject scripts when user actively clicks the extension
chrome.action.onClicked.addListener(async (tab) => {
  console.log('🖱️ Extension icon clicked, injecting content script...');
  
  try {
    // Check if content script is already injected
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return window.aiCoverLetterExtensionInjected === true;
      }
    });
    
    if (results[0]?.result) {
      console.log('✅ Content script already injected, checking job page...');
      // Content script already exists, just check for job content
      chrome.tabs.sendMessage(tab.id, { action: 'checkJobPage' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Could not communicate with content script:', chrome.runtime.lastError);
          return;
        }
        
        if (!response?.isJobPage) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icons/icon128.png',
            title: 'AI Cover Letter Generator',
            message: 'No job description detected on this page. Please navigate to a job listing and click the extension again.'
          });
        }
      });
      return;
    }
    
    console.log('📋 Injecting content script and CSS...');
    
    // Inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["js/content-script.js"]
    });
    
    // Inject CSS if needed
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["css/content.css"]
    });
    
    // Set flag to prevent double injection
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        window.aiCoverLetterExtensionInjected = true;
      }
    });
    
    console.log('✅ Content script injected successfully');
    
    // Give the content script a moment to initialize, then check for job content
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, {action: 'checkJobPage'}, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Could not communicate with content script:', chrome.runtime.lastError);
          return;
        }
        
        if (!response?.isJobPage) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icons/icon128.png',
            title: 'AI Cover Letter Generator',
            message: 'No job description detected on this page. Please navigate to a job listing and click the extension again.'
          });
        }
      });
    }, 500);
    
  } catch (error) {
    console.error('❌ Error injecting content script:', error);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icons/icon128.png',
      title: 'AI Cover Letter Generator - Error',
      message: 'Could not inject content script. Please refresh the page and try again.'
    });
  }
});