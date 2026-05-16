// Collapse-tab-group snippet: collapses the active tab group when the active tab belongs to one.
(function () {
  const id = 'collapse-tab-group';

  async function collapseActiveTabGroup() {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      tabs.sort((a, b) => a.index - b.index);

      const activeTab = tabs.find((tab) => tab.active);
      if (!activeTab || typeof activeTab.groupId !== 'number' || activeTab.groupId === -1) return;

      const groupTabs = tabs.filter((tab) => tab.groupId === activeTab.groupId);
      if (!groupTabs.length) return;

      const groupStartIndex = groupTabs[0].index;
      const groupEndIndex = groupTabs[groupTabs.length - 1].index;

      await chrome.tabGroups.update(activeTab.groupId, { collapsed: true });

      const rightTab = tabs.find((tab) => tab.index > groupEndIndex);
      if (rightTab && typeof rightTab.id === 'number') {
        await chrome.tabs.update(rightTab.id, { active: true });
        return;
      }

      const leftTabs = tabs.filter((tab) => tab.index < groupStartIndex);
      const leftTab = leftTabs[leftTabs.length - 1];
      if (leftTab && typeof leftTab.id === 'number') {
        await chrome.tabs.update(leftTab.id, { active: true });
        return;
      }

      await chrome.tabs.create({
        index: groupEndIndex + 1,
        active: true,
      });
    } catch (err) {
      console.error('collapse-tab-group error', err);
    }
  }

  registerSnippet({
    id,
    name: 'Collapse tab group',
    description: 'Collapse the active tab group when the current tab belongs to one.',
    command: {
      id: 'collapse-tab-group',
      suggested_key: {
        windows: 'Alt+C',
        mac: 'Command+Shift+C',
      },
      run: collapseActiveTabGroup,
    },
  });
})();