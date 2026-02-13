# Chrome Utilities

A Chrome extension that provides a collection of small, useful snippets you can easily enable or disable from a popup interface.

## Overview

Chrome Utilities is a lightweight extension that lets you manage a marketplace of small JavaScript snippets. Toggle them on or off as needed, and your preferences sync across browsers via Chrome's sync feature.

## Features

- **Snippet Management UI**: Clean popup interface to enable/disable snippets
- **Persistent Storage**: Preferences automatically sync across Chrome browsers
- **Keyboard Shortcuts**: Quick commands for common tasks
- **Easy Customization**: Add new snippets by creating files in the `snippets/` folder

## Available Snippets

Currently included:
- **Tab Utility**: Create new tabs to the right with `Alt+T` (or `Cmd+T` on Mac)

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select this folder

## Usage

1. Click the extension icon in Chrome's toolbar
2. Toggle snippets on/off as needed
3. Your settings are saved and synced across devices

## Adding Custom Snippets

To add your own snippets:

1. Add a new entry to `snippets/snippets.json`:
   ```json
   {
     "id": "my-snippet",
     "name": "My Snippet",
     "description": "What it does",
     "file": "my-snippet.js"
   }
   ```

2. Create the snippet file in `snippets/` folder
3. Reload the extension and your snippet will appear in the popup

## File Structure

```
chrome-utilities/
├── manifest.json           # Extension configuration
├── background.js           # Service worker
├── popup.html              # Popup UI
├── popup.css               # Popup styles
├── popup.js                # Popup logic
├── snippets/
│   ├── snippets.json       # Snippet registry
│   └── tab-utility.js      # Tab utility snippet
└── README.md               # This file
```

## Permissions

- `storage`: Save and sync your snippet preferences
- `tabs`: Interact with browser tabs
- `activeTab`: Access the active tab

## License

Open source - feel free to modify and extend!
