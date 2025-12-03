// Load saved config
chrome.storage.local.get(['notionToken', 'notionPageId'], (result) => {
  if (result.notionToken) {
    document.getElementById('notion-token').value = result.notionToken;
  }
  if (result.notionPageId) {
    document.getElementById('page-id').value = result.notionPageId;
  }
});

// Save configuration
document.getElementById('save-btn').addEventListener('click', () => {
  const token = document.getElementById('notion-token').value.trim();
  const pageId = document.getElementById('page-id').value.trim();
  
  if (!token || !pageId) {
    showStatus('Please fill in both fields', 'error');
    return;
  }
  
  chrome.storage.local.set({
    notionToken: token,
    notionPageId: pageId
  }, () => {
    showStatus('✅ Configuration saved!', 'success');
  });
});

// Test connection
document.getElementById('test-btn').addEventListener('click', async () => {
  const token = document.getElementById('notion-token').value.trim();
  let pageId = document.getElementById('page-id').value.trim();
  
  if (!token || !pageId) {
    showStatus('Please fill in both fields', 'error');
    return;
  }
  
  // Extract just the ID from the page ID (in case user pasted full URL)
  pageId = pageId.split('?')[0].split('/').pop().replace(/-/g, '');
  
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
      }
    });
    
    if (response.ok) {
      showStatus('✅ Connection successful!', 'success');
    } else {
      const error = await response.json();
      showStatus('❌ ' + (error.message || 'Connection failed'), 'error');
    }
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
  }
});

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
