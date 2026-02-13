// popup.js: renders the list of snippets and toggles enabled state in chrome.storage.sync

async function fetchSnippets() {
  const url = chrome.runtime.getURL('snippets/snippets.json');
  const res = await fetch(url);
  return await res.json();
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

async function init() {
  const snippets = await fetchSnippets();
  const stored = await chrome.storage.sync.get({ enabledSnippets: {} });
  const enabled = stored.enabledSnippets || {};
  renderList(snippets, enabled);
}

document.addEventListener('DOMContentLoaded', init);
