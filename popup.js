// Load and display snippets
function loadSnippets(searchTerm = '') {
  chrome.storage.local.get(['snippets'], (result) => {
    const snippets = result.snippets || [];
    const container = document.getElementById('snippets-list');
    
    // Filter snippets based on search
    const filtered = searchTerm 
      ? snippets.filter(s => 
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : snippets;
    
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>${searchTerm ? 'No snippets found' : 'No snippets saved yet'}</p>
          ${!searchTerm ? '<p style="font-size: 12px; margin-top: 8px;">Click on any AI response in ChatGPT or Gemini to save it</p>' : ''}
        </div>
      `;
      return;
    }
    
    container.innerHTML = filtered.map(snippet => `
      <div class="snippet-item" data-id="${snippet.id}">
        <div class="snippet-header">
          <div class="snippet-title">${escapeHtml(snippet.title)}</div>
        </div>
        <div class="snippet-meta">
          <span class="snippet-source">${snippet.source}</span>
          <span>${formatDate(snippet.timestamp)}</span>
        </div>
        <div class="snippet-content">${escapeHtml(snippet.content.substring(0, 150))}...</div>
        <div class="snippet-actions">
          <button class="btn btn-copy" data-id="${snippet.id}">Copy</button>
          <button class="btn btn-delete" data-id="${snippet.id}">Delete</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    container.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        copySnippet(btn.dataset.id);
      });
    });
    
    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSnippet(btn.dataset.id);
      });
    });
    
    // Click on snippet to copy
    container.querySelectorAll('.snippet-item').forEach(item => {
      item.addEventListener('click', () => {
        copySnippet(item.dataset.id);
      });
    });
  });
}

// Copy snippet to clipboard
function copySnippet(id) {
  chrome.storage.local.get(['snippets'], (result) => {
    const snippet = result.snippets.find(s => s.id == id);
    if (snippet) {
      navigator.clipboard.writeText(snippet.content).then(() => {
        showNotification('Copied to clipboard!');
      });
    }
  });
}

// Delete snippet
function deleteSnippet(id) {
  chrome.storage.local.get(['snippets'], (result) => {
    const snippets = result.snippets.filter(s => s.id != id);
    chrome.storage.local.set({ snippets }, () => {
      loadSnippets(document.getElementById('search-input').value);
      showNotification('Snippet deleted');
    });
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 2000);
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
  loadSnippets(e.target.value);
});

// Setup Notion button
document.getElementById('setup-notion-btn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'notion-config.html' });
});

// Load snippets on popup open
loadSnippets();
