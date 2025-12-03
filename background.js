// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Creating context menu...');
  chrome.contextMenus.create({
    id: 'saveToNotion',
    title: '💾 Save to Notion',
    contexts: ['selection']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Context menu error:', chrome.runtime.lastError);
    } else {
      console.log('Context menu created successfully');
    }
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToNotion') {
    const selectedText = info.selectionText;
    
    console.log('Context menu clicked, sending to tab:', tab.id);
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'saveToNotion',
      text: selectedText,
      url: tab.url
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
      }
    });
  }
});

// Handle API calls from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToNotionAPI') {
    saveToNotionAPI(request).then(sendResponse);
    return true; // Keep channel open for async response
  }
});

async function saveToNotionAPI({ title, text, url, token, pageId }) {
  try {
    // Extract just the ID from the page ID (in case user pasted full URL)
    const cleanPageId = pageId.split('?')[0].split('/').pop().replace(/-/g, '');
    
    const now = new Date().toLocaleString();
    
    const response = await fetch(`https://api.notion.com/v1/blocks/${cleanPageId}/children`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        children: [
          {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ text: { content: title } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: text } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                { 
                  text: { 
                    content: `Source: ${url} | Saved: ${now}`,
                    link: { url: url }
                  },
                  annotations: { color: 'gray' }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'divider',
            divider: {}
          }
        ]
      })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      console.error('Notion API error:', error);
      return { success: false, error: error.message || 'Failed to save' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}
