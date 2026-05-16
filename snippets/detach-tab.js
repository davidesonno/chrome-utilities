// Detach-tab snippet: moves the active tab into a new maximized window.
(function () {
  const id = 'detach-tab';

  async function detachCurrentTabToMaximizedWindow() {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
      const activeTab = tabs[0];
      if (!activeTab || typeof activeTab.windowId !== 'number') return;

      const currentWindowTabs = await chrome.tabs.query({ windowId: activeTab.windowId });
      if (currentWindowTabs.length <= 1) return;

      await chrome.windows.create({
        tabId: activeTab.id,
        state: 'maximized',
      });
    } catch (err) {
      console.error('detach-tab error', err);
    }
  }

  registerSnippet({
    id,
    name: 'Detach tab',
    description: 'Detach the active tab into a new maximized window.',
    command: {
      id: 'detach-current-tab',
      suggested_key: {
        windows: 'Alt+N',
        mac: 'Command+N',
      },
      run: detachCurrentTabToMaximizedWindow,
    },
  });
})();