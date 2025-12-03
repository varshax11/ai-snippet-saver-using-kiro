// SIMPLE VERSION - Uses native browser prompt
console.log('AI Snippet Saver: Script loaded');

const platform = window.location.hostname.includes('openai') || window.location.hostname.includes('chatgpt') 
  ? 'chatgpt' 
  : 'gemini';

console.log('AI Snippet Saver: Platform detected:', platform);

const selectors = {
  chatgpt: [
    '[data-message-author-role="assistant"]',
    '.group.agent',
    'div[class*="agent"]'
  ],
  gemini: [
    '.model-response-text',
    '[data-test-id="model-response"]',
    '.response-container'
  ]
};

function saveSnippet(title, content) {
  const snippet = {
    id: Date.now(),
    title: title || 'Untitled Snippet',
    content,
    source: platform,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  chrome.storage.local.get(['snippets'], (result) => {
    const snippets = result.snippets || [];
    snippets.unshift(snippet);
    chrome.storage.local.set({ snippets }, () => {
      console.log('Snippet saved:', snippet);
      
      // Show success message
      const msg = document.createElement('div');
      msg.textContent = '✅ Snippet saved!';
      msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 999999;
        font-family: sans-serif;
      `;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    });
  });
}

function addSaveButtons() {
  const selectorList = selectors[platform];
  let foundCount = 0;
  
  for (const selector of selectorList) {
    const responses = document.querySelectorAll(selector);
    console.log(`Checking selector "${selector}": found ${responses.length} elements`);
    
    responses.forEach(response => {
      // Skip if already has button
      if (response.querySelector('.snippet-save-btn-inline')) return;
      
      // Create save button
      const btn = document.createElement('button');
      btn.className = 'snippet-save-btn-inline';
      btn.textContent = '💾 Save';
      btn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      
      // Make parent relative if needed
      const position = getComputedStyle(response).position;
      if (position === 'static') {
        response.style.position = 'relative';
      }
      
      // Show button on hover
      response.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
      });
      
      response.addEventListener('mouseleave', () => {
        btn.style.opacity = '0';
      });
      
      // Handle click
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Save button clicked');
        
        const content = response.innerText;
        console.log('Content length:', content.length);
        
        // Use setTimeout to ensure prompt appears
        setTimeout(() => {
          const title = window.prompt('Enter a title for this snippet:', 'Untitled Snippet');
          console.log('User entered title:', title);
          
          if (title !== null) {
            saveSnippet(title, content);
          }
        }, 0);
      });
      
      response.appendChild(btn);
      foundCount++;
    });
    
    if (responses.length > 0) {
      console.log(`AI Snippet Saver: Added ${foundCount} save buttons`);
      break;
    }
  }
}

// Watch for new responses
const observer = new MutationObserver(() => {
  addSaveButtons();
});

// Initialize
function init() {
  console.log('AI Snippet Saver: Initializing...');
  addSaveButtons();
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('AI Snippet Saver: Observer started');
}

// Start after page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 1000);
}
