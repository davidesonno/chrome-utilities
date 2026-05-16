// Snippet loader for "Chrome Utilities" extension.
// Snippets call `registerSnippet({ id, name, description, command, init, dispose })` on load.

const snippets = {};
const commandHandlers = {};

function registerSnippet(meta) {
  if (!meta || !meta.id) return;
  const normalized = Object.assign({ active: false }, meta);
  snippets[normalized.id] = normalized;

  const command = normalized.command;
  if (command && command.id && typeof command.run === 'function') {
    commandHandlers[command.id] = {
      snippetId: normalized.id,
      run: command.run,
    };
  }
}

// expose globally so snippet files can call it when imported
self.registerSnippet = registerSnippet;

async function activateSnippet(id) {
  const s = snippets[id];
  if (!s || s.active) return;
  try {
    if (typeof s.init === 'function') await s.init();
    s.active = true;
    console.log(`Snippet activated: ${id}`);
  } catch (err) {
    console.error('Error activating snippet', id, err);
  }
}

async function deactivateSnippet(id) {
  const s = snippets[id];
  if (!s || !s.active) return;
  try {
    if (typeof s.dispose === 'function') await s.dispose();
    s.active = false;
    console.log(`Snippet deactivated: ${id}`);
  } catch (err) {
    console.error('Error deactivating snippet', id, err);
  }
}

async function syncActivateAll() {
  const stored = await chrome.storage.sync.get({ enabledSnippets: {} });
  const enabled = stored.enabledSnippets || {};
  for (const id of Object.keys(snippets)) {
    if (enabled[id] === undefined) {
      enabled[id] = true;
    }

    if (enabled[id]) await activateSnippet(id);
    else await deactivateSnippet(id);
  }

  await chrome.storage.sync.set({ enabledSnippets: enabled });
}

async function handleCommand(commandId) {
  const handler = commandHandlers[commandId];
  if (!handler) return;

  const stored = await chrome.storage.sync.get({ enabledSnippets: {} });
  const enabled = stored.enabledSnippets || {};
  if (!enabled[handler.snippetId]) return;

  try {
    await handler.run();
  } catch (err) {
    console.error('Error running command', commandId, err);
  }
}

// Import snippet files. Each snippet file should call registerSnippet(...) when executed.
try {
  importScripts('generated/generated-loader.js');
} catch (err) {
  console.warn('Failed to import snippet files:', err);
}

chrome.commands.onCommand.addListener((commandId) => {
  handleCommand(commandId);
});

// Initialize: ensure enabled snippets become active.
syncActivateAll();

// react to storage changes (popup will update enabledSnippets)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (changes.enabledSnippets) {
    const newVal = changes.enabledSnippets.newValue || {};
    const oldVal = changes.enabledSnippets.oldValue || {};
    // determine diffs
    for (const id of Object.keys(snippets)) {
      const was = !!oldVal[id];
      const now = !!newVal[id];
      if (was !== now) {
        if (now) activateSnippet(id);
        else deactivateSnippet(id);
      }
    }
  }
});

// On install, ensure there's a default enabled snippet map.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabledSnippets: {} }, (res) => {
    const enabled = res.enabledSnippets || {};
    let changed = false;
    for (const id of Object.keys(snippets)) {
      if (enabled[id] === undefined) {
        enabled[id] = true;
        changed = true;
      }
    }

    if (changed) {
      chrome.storage.sync.set({ enabledSnippets: enabled });
    }
  });
});
