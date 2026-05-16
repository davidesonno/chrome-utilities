// Tab to the right snippet: creates a new tab to the right when the command is triggered.
(function () {
  const id = 'tab-to-right';

  async function createTabToTheRight() {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      tabs.sort((a, b) => a.index - b.index);
      const activeTab = tabs.find((t) => t.active);
      if (!activeTab) return;

      const newIndex = activeTab.index + 1;
      const newTab = await chrome.tabs.create({ index: newIndex });
      const newGroupId = activeTab.groupId !== -1 ? activeTab.groupId : undefined;
      if (newGroupId !== undefined && newTab && typeof newTab.id === 'number') {
        await chrome.tabs.group({ groupId: newGroupId, tabIds: [newTab.id] });
      }
    } catch (err) {
      console.error('tab-to-right error', err);
    }
  }

  registerSnippet({
    id,
    name: 'Tab to the right',
    description: 'Create a new tab immediately to the right of the active tab.',
    command: {
      id: 'add-new-tab',
      suggested_key: {
        windows: 'Alt+T',
        mac: 'Command+T',
      },
      run: createTabToTheRight,
    },
  });
})();