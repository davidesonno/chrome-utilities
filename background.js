// Snippet loader for "Chrome Utilities" extension.
// Snippets call `registerSnippet({ id, name, description, init, dispose })` on load.

const snippets = {};

function registerSnippet(meta) {
  if (!meta || !meta.id) return;
  snippets[meta.id] = Object.assign({ active: false }, meta);
  // keep metadata small and serializable
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
    if (enabled[id]) await activateSnippet(id);
    else await deactivateSnippet(id);
  }
}

// Import snippet files. Each snippet file should call registerSnippet(...) when executed.
try {
  importScripts('snippets/tab-utility.js');
  // future snippets: importScripts('snippets/another-snippet.js');
} catch (err) {
  console.warn('Failed to import snippet files:', err);
}

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

// On install, ensure there's a default enabled snippet map (enable tab-utility by default)
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabledSnippets: {} }, (res) => {
    const enabled = res.enabledSnippets || {};
    if (enabled['tab-utility'] === undefined) {
      enabled['tab-utility'] = true;
      chrome.storage.sync.set({ enabledSnippets: enabled });
    }
  });
});
