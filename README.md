# Chrome Utilities

A small Chrome extension for managing a set of self-contained snippets from a popup.

## Requisites

Before using or extending the extension, make sure you have:

- Google Chrome with extension support enabled
- Developer mode access at `chrome://extensions/`
- Node.js installed so you can run the snippet build step
- Windows, macOS, or Linux for the host system

## What It Does

- Shows available snippets in a popup
- Lets you enable or disable snippets independently
- Registers keyboard commands from each snippet definition
- Generates the manifest and popup data from the snippet files

## Current Snippets

- **Tab to the Right**: Creates a new tab immediately to the right of the active tab
- **Detach Tab**: Moves the active tab into a new maximized window

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked and select this folder.

## Usage

1. Click the extension icon in Chrome's toolbar.
2. Toggle the snippets you want to keep active.
3. Use the assigned shortcut for each snippet.

## Add A Snippet

To add a new snippet:

1. Create a new JavaScript file in `snippets/`.
2. Register the snippet inside that file with its metadata and one command.
3. Run `node tools/build-snippets.mjs`.
4. Reload the extension in Chrome.

The build step scans `snippets/`, validates each snippet, and regenerates the derived files in `generated/` plus `manifest.json`.

Generated files are:

- `generated/generated-index.js` for the popup
- `generated/generated-loader.js` for the service worker
- `manifest.json` for command registrations

## File Structure

```
chrome-utilities/
├── manifest.json           # Extension configuration
├── background.js           # Service worker
├── popup.html              # Popup UI
├── popup.css               # Popup styles
├── popup.js                # Popup logic
├── tools/
│   └── build-snippets.mjs  # Generates manifest and derived files from snippets/
├── generated/
│   ├── generated-index.js   # Generated snippet metadata for the popup
│   └── generated-loader.js  # Generated import list for snippet files
├── snippets/
│   ├── detach-tab.js        # Detach tab snippet
│   └── tab-to-right.js      # Tab to the right snippet
└── README.md               # This file
```

## Permissions

- `storage`: Save and sync snippet preferences
- `tabs`: Read and move tabs
- `windows`: Create and maximize detached windows
- `activeTab`: Access the active tab when a command runs

## License

Open source - feel free to modify and extend!
