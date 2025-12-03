# AI Snippet Saver - Chrome Extension

A Chrome extension that saves selected text from ChatGPT and Gemini directly to Notion with one click.

## 🎯 Problem

When working with AI chatbots like ChatGPT and Gemini, users often need to save specific portions of responses for later reference. The traditional workflow involves:
1. Manually selecting and copying text
2. Opening Notion
3. Creating a new entry
4. Pasting the content
5. Adding context (source, timestamp)

This repetitive process breaks focus and wastes time.

## ✨ Solution

AI Snippet Saver streamlines this workflow into a single action:
1. Select any text on ChatGPT/Gemini
2. Right-click → "Save to Notion"
3. Enter a title
4. Done! Text is saved to your Notion page with source link and timestamp

## 🚀 Features

- **One-click saving**: Right-click context menu integration
- **Direct Notion integration**: Saves to a single Notion page
- **Automatic metadata**: Includes source URL and timestamp
- **Smart formatting**: Adds headings, dividers, and proper structure
- **Works on multiple platforms**: ChatGPT and Gemini support

## 📦 Installation

### Prerequisites
- Chrome browser
- Notion account
- Notion integration token

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-snippet-saver.git
   cd ai-snippet-saver
   ```

2. **Load the extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the project folder

3. **Configure Notion**
   - Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Copy the integration token
   - Create a page in Notion for your snippets
   - Share the page with your integration
   - Copy the page ID from the URL
   - Click the extension icon → "Setup Notion Integration"
   - Enter your token and page ID

## 🎬 Usage

1. Visit ChatGPT or Gemini
2. Select any text you want to save
3. Right-click on the selection
4. Click "💾 Save to Notion"
5. Enter a title when prompted
6. Check your Notion page - the snippet is saved!

## 🏗️ Architecture

### Files Structure

```
ai-snippet-saver/
├── manifest.json           # Extension configuration
├── background.js           # Service worker (handles API calls)
├── content.js             # Content script (runs on ChatGPT/Gemini)
├── popup.html/js          # Extension popup interface
├── notion-config.html/js  # Notion setup page
├── styles.css             # UI styling
├── icon*.png              # Extension icons
└── README.md              # This file
```

### How It Works

1. **Context Menu**: `background.js` creates a right-click menu option
2. **Message Passing**: When clicked, sends selected text to `content.js`
3. **User Input**: `content.js` prompts for title and retrieves credentials
4. **API Call**: Sends data back to `background.js` which calls Notion API
5. **Feedback**: Shows success/error notification to user

### Why This Architecture?

- Content scripts can't directly call external APIs due to CORS
- Background service worker has full API access
- This separation keeps the extension secure and functional

## 🔧 Technical Details

### Notion API Integration

The extension uses Notion's API v1 to append blocks to a page:

```javascript
fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
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
})
```

### Permissions Required

- `storage`: Save Notion credentials locally
- `contextMenus`: Add right-click menu option
- `host_permissions`: Access Notion API

## 🤖 Built with Kiro

This project was developed using Kiro, an AI-powered IDE that significantly accelerated development:

### Development Speed
- **Initial prototype**: 30 minutes (vs 3-4 hours manually)
- **Notion integration**: 20 minutes (vs 2 hours of API documentation reading)
- **Bug fixes**: Real-time debugging with instant solutions

### Key Kiro Features Used
1. **Rapid scaffolding**: Generated entire extension structure instantly
2. **API integration**: Kiro handled Notion API complexity automatically
3. **Debugging**: Identified and fixed CORS issues, message passing errors
4. **Iteration**: Quick pivots from database to page-based saving
5. **Icon generation**: Automated image resizing for extension icons

### Time Saved
- **Total development time**: ~2 hours
- **Estimated manual time**: 8-10 hours
- **Time saved**: 75-80%

## 📝 Blog Post

For a detailed walkthrough of how this extension was built with Kiro, read the blog post:
[Building an AI Snippet Saver with Kiro - AWS Builder Center](#)

## 🐛 Troubleshooting

### Extension not loading
- Ensure you've enabled Developer mode in `chrome://extensions/`
- Check that all files are in the project folder
- Try removing and re-adding the extension

### "Please configure Notion first" error
- Make sure you've completed the Notion setup
- Verify your integration token is correct
- Ensure the page is shared with your integration

### Text not saving
- Check browser console (F12) for errors
- Verify your page ID is correct (just the ID, not full URL)
- Test the connection in the setup page

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Built with [Kiro](https://kiro.ai) - AI-powered development
- Uses [Notion API](https://developers.notion.com/)
- Icons designed with emoji

## 🔗 Links

- [GitHub Repository](#)
- [Blog Post - AWS Builder Center](#)
- [Notion API Documentation](https://developers.notion.com/)

---

**Note**: This project was created as part of the Kiro Builder Challenge.
