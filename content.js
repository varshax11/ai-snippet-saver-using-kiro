// AI Snippet Saver - Save selected text to Notion
console.log('🎯 AI Snippet Saver: Content script loaded successfully!');
console.log('🎯 Current URL:', window.location.href);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request.action);
  if (request.action === 'saveToNotion') {
    saveToNotion(request.text, request.url);
    return true; // Keep channel open
  }
});

function saveToNotion(text, url) {
  console.log('saveToNotion called with text length:', text.length);
  
  // Get Notion credentials
  chrome.storage.local.get(['notionToken', 'notionPageId'], (result) => {
    console.log('Got credentials:', { hasToken: !!result.notionToken, hasPageId: !!result.notionPageId });
    
    if (!result.notionToken || !result.notionPageId) {
      showNotification('⚠️ Please configure Notion first', '#FF9800');
      return;
    }
    
    // Prompt for title
    const title = window.prompt('Enter a title for this snippet:', 'Untitled');
    if (title === null) return;
    
    console.log('Sending to background script...');
    
    // Send to background script to make API call
    chrome.runtime.sendMessage({
      action: 'saveToNotionAPI',
      title: title,
      text: text,
      url: url,
      token: result.notionToken,
      pageId: result.notionPageId
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message error:', chrome.runtime.lastError);
        showNotification('❌ Connection error', '#f44336');
        return;
      }
      
      console.log('Got response:', response);
      
      if (response && response.success) {
        showNotification('✅ Saved to Notion!', '#4CAF50');
      } else {
        showNotification('❌ ' + (response?.error || 'Unknown error'), '#f44336');
      }
    });
  });
}

function showNotification(message, color) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    z-index: 999999;
    font-family: sans-serif;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

console.log('AI Snippet Saver: Ready to save selections to Notion');
