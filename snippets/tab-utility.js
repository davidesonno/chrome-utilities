// Tab utility snippet: creates a new tab to the right when the command is triggered.
(function () {
  const id = 'tab-utility';
  let handler = null;

  function init() {
    handler = async (command) => {
      if (command !== 'add-new-tab') return;
      try {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        tabs.sort((a, b) => a.index - b.index);
        const activeTab = tabs.find((t) => t.active);
        if (!activeTab) return;
        const newIndex = activeTab.index + 1;
        const newTab = await chrome.tabs.create({ index: newIndex });
        const newGroupId = activeTab.groupId !== -1 ? activeTab.groupId : undefined;
        if (newGroupId !== undefined) {
          chrome.tabs.group({ groupId: newGroupId, tabIds: [newTab.id] });
        }
      } catch (err) {
        console.error('tab-utility error', err);
      }
    };

    chrome.commands.onCommand.addListener(handler);
  }

  function dispose() {
    if (handler) chrome.commands.onCommand.removeListener(handler);
    handler = null;
  }

  registerSnippet({
    id,
    name: 'Tab utility',
    description: 'New tab on the right (Alt+T).',
    init,
    dispose,
  });
})();
