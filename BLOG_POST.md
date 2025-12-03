# Building an AI Snippet Saver Chrome Extension with Kiro

## The Problem: Context Switching Kills Productivity

As someone who frequently uses ChatGPT and Gemini for research and problem-solving, I found myself constantly copying snippets of AI responses into Notion for later reference. The workflow was tedious:

1. Read an interesting AI response
2. Select and copy the text
3. Switch to Notion
4. Create a new entry
5. Paste the content
6. Add metadata (source, date)
7. Switch back to the AI chat

This context switching happened dozens of times per day, breaking my flow and wasting precious minutes. I needed a solution that would let me save snippets without leaving the AI chat interface.

## The Solution: One-Click Notion Integration

I decided to build a Chrome extension that would:
- Add a right-click menu option on ChatGPT and Gemini
- Save selected text directly to Notion
- Automatically include source links and timestamps
- Require minimal user interaction

The result? **AI Snippet Saver** - a Chrome extension that reduces a 7-step process to just 3 clicks.

## Why Kiro Changed Everything

I've built Chrome extensions before. Typically, it takes me 8-10 hours to go from idea to working prototype. With Kiro, I completed this project in **under 2 hours**. Here's how:

### 1. Instant Project Scaffolding (5 minutes vs 30 minutes)

Instead of manually creating files and setting up the extension structure, I simply told Kiro:

> "Build a browser extension that lets me save snippets from ChatGPT responses"

Kiro immediately generated:
- `manifest.json` with proper permissions
- Content script for page interaction
- Background service worker
- Popup interface
- Icon files

**Kiro in action:**
```javascript
// Kiro generated this complete manifest.json instantly
{
  "manifest_version": 3,
  "name": "AI Snippet Saver",
  "permissions": ["storage", "contextMenus"],
  "content_scripts": [{
    "matches": ["https://chatgpt.com/*", "https://gemini.google.com/*"],
    "js": ["content.js"]
  }]
}
```

### 2. Notion API Integration (20 minutes vs 2 hours)

Integrating with Notion's API typically requires:
- Reading documentation
- Understanding authentication
- Figuring out block structure
- Handling CORS issues

I told Kiro: "Save selected text to a Notion page"

Kiro:
1. Set up the API authentication flow
2. Created a configuration page for tokens
3. Implemented the block creation logic
4. Handled CORS by routing through the background script

**The API call Kiro generated:**
```javascript
async function saveToNotionAPI({ title, text, url, token, pageId }) {
  const cleanPageId = pageId.split('?')[0].split('/').pop().replace(/-/g, '');
  
  const response = await fetch(`https://api.notion.com/v1/blocks/${cleanPageId}/children`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      children: [
        { type: 'heading_3', heading_3: { rich_text: [{ text: { content: title } }] } },
        { type: 'paragraph', paragraph: { rich_text: [{ text: { content: text } }] } },
        { type: 'divider', divider: {} }
      ]
    })
  });
  
  return response.ok ? { success: true } : { success: false, error: 'Failed to save' };
}
```

### 3. Real-Time Debugging (30 minutes vs 2 hours)

During development, I hit several issues:
- CORS errors when calling Notion API
- Message passing between content and background scripts
- Page ID format parsing

Each time, I simply pasted the error into Kiro:

> "Uncaught TypeError: Cannot read properties of undefined (reading 'local')"

Kiro immediately identified the issue (Chrome API not available in content script context) and provided the fix. No Stack Overflow searching, no trial and error.

### 4. Iterative Refinement (45 minutes vs 3 hours)

My initial idea was to save snippets to a Notion database. After testing, I realized a single page would be simpler. I told Kiro:

> "Change it to save to a Notion page instead of a database"

Kiro:
1. Updated the API calls
2. Modified the configuration page
3. Changed the page ID extraction logic
4. Updated all documentation

This pivot would have taken hours manually. With Kiro, it took 5 minutes.

## Technical Architecture

### Message Flow

```
User selects text
    ↓
Right-click menu (background.js)
    ↓
Send to content.js
    ↓
Prompt for title
    ↓
Get credentials from storage
    ↓
Send to background.js
    ↓
Call Notion API
    ↓
Show success notification
```

### Key Files

**manifest.json** - Extension configuration
```json
{
  "manifest_version": 3,
  "permissions": ["storage", "contextMenus"],
  "host_permissions": ["https://api.notion.com/*"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["https://chatgpt.com/*"],
    "js": ["content.js"]
  }]
}
```

**background.js** - Handles API calls (avoids CORS)
```javascript
chrome.contextMenus.create({
  id: 'saveToNotion',
  title: '💾 Save to Notion',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, {
    action: 'saveToNotion',
    text: info.selectionText,
    url: tab.url
  });
});
```

**content.js** - Runs on ChatGPT/Gemini pages
```javascript
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'saveToNotion') {
    const title = window.prompt('Enter a title:', 'Untitled');
    if (title) {
      chrome.runtime.sendMessage({
        action: 'saveToNotionAPI',
        title, text: request.text, url: request.url
      });
    }
  }
});
```

## Results & Impact

### Time Savings
- **Development time**: 2 hours (vs 8-10 hours manually)
- **Time saved per use**: 30 seconds per snippet
- **Daily usage**: ~20 snippets
- **Daily time saved**: 10 minutes
- **Monthly time saved**: 5 hours

### Code Quality
Kiro generated production-ready code with:
- Proper error handling
- Clean architecture
- Security best practices
- Comprehensive comments

### Learning Curve
Instead of spending hours reading Notion API docs and Chrome extension guides, I learned by doing. Kiro explained concepts as we built, making the development process educational.

## Lessons Learned

### 1. AI-Assisted Development is Real
This isn't just autocomplete. Kiro understands context, architecture, and best practices. It's like pair programming with an expert who never gets tired.

### 2. Iteration Speed Matters
The ability to pivot quickly (database → page) without rewriting everything is game-changing. Ideas that would have been "too much work" become feasible.

### 3. Focus on Problems, Not Implementation
I spent my time thinking about user experience and features, not syntax and API documentation. Kiro handled the implementation details.

## Try It Yourself

### Installation
1. Clone the repo: `git clone https://github.com/yourusername/ai-snippet-saver`
2. Load in Chrome: `chrome://extensions/` → Load unpacked
3. Configure Notion: Click extension icon → Setup
4. Start saving: Select text → Right-click → Save to Notion

### Source Code
Full source code with the `.kiro` directory included:
[GitHub Repository](#)

## Conclusion

Building this extension manually would have taken me a full workday. With Kiro, I completed it in 2 hours while learning new concepts along the way.

The future of development isn't about replacing developers—it's about amplifying our capabilities. Kiro lets us focus on solving problems while it handles the implementation details.

If you're building anything that involves APIs, Chrome extensions, or rapid prototyping, give Kiro a try. It might just change how you think about development.

---

**Built with**: Kiro, Chrome Extensions API, Notion API  
**Time to build**: 2 hours  
**Lines of code**: ~500  
**Time saved**: 75%  

**Try Kiro**: [kiro.ai](https://kiro.ai)  
**Source Code**: [GitHub](#)

---

*This post was written as part of the Kiro Builder Challenge. All code and development process are documented in the repository.*
