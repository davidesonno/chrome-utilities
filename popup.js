// popup.js: renders the list of snippets and toggles enabled state in chrome.storage.sync

function formatShortcut(suggestedKey) {
  if (!suggestedKey) return 'Not assigned';

  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const isMac = /mac/i.test(platform);
  const isWindows = /win/i.test(platform);

  if (isMac && suggestedKey.mac) return suggestedKey.mac;
  if (isWindows && suggestedKey.windows) return suggestedKey.windows;
  if (suggestedKey.default) return suggestedKey.default;

  return suggestedKey.mac || suggestedKey.windows || suggestedKey.linux || suggestedKey.chromeos || 'Not assigned';
}

function renderList(snippets, enabledMap) {
  const container = document.getElementById('list');
  container.innerHTML = '';
  for (const sn of snippets) {
    const item = document.createElement('div');
    item.className = 'item';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('h3');
    title.textContent = sn.name;
    const desc = document.createElement('p');
    desc.textContent = sn.description || '';
    meta.appendChild(title);
    meta.appendChild(desc);

    const command = document.createElement('p');
    command.className = 'command';
    const commandLabel = document.createElement('span');
    commandLabel.textContent = 'Shortcut';
    const commandValue = document.createElement('kbd');
    commandValue.textContent = formatShortcut(sn.command && sn.command.suggested_key);
    command.appendChild(commandLabel);
    command.appendChild(commandValue);
    meta.appendChild(command);

    const control = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!enabledMap[sn.id];
    checkbox.addEventListener('change', async () => {
      const stored = await chrome.storage.sync.get({ enabledSnippets: {} });
      const enabled = stored.enabledSnippets || {};
      enabled[sn.id] = checkbox.checked;
      await chrome.storage.sync.set({ enabledSnippets: enabled });
    });
    control.appendChild(checkbox);

    item.appendChild(meta);
    item.appendChild(control);
    container.appendChild(item);
  }
}

function applyDefaultEnabledState(snippets, enabledMap) {
  let changed = false;
  for (const sn of snippets) {
    if (enabledMap[sn.id] === undefined) {
      enabledMap[sn.id] = true;
      changed = true;
    }
  }

  return changed;
}

async function init() {
  const snippets = Array.isArray(window.__SNIPPETS__) ? window.__SNIPPETS__ : [];
  const stored = await chrome.storage.sync.get({ enabledSnippets: {} });
  const enabled = stored.enabledSnippets || {};

  if (applyDefaultEnabledState(snippets, enabled)) {
    await chrome.storage.sync.set({ enabledSnippets: enabled });
  }

  renderList(snippets, enabled);
}

document.addEventListener('DOMContentLoaded', init);
