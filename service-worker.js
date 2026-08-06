chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case "tab-next":
            tab('next');
            break;

        case "tab-previous":
            tab('previous');
            break;
    }
});

async function tab(direction='next') {
    const tabs      = await chrome.tabs.query({});
    const activeTab = tabs.find(t => t.active);

    if (activeTab == null || tabs.length == 1)
        return;

    const offset = direction === 'next' ? -1 : 1;

    const prevTab = 
           tabs.find(t => t.index === activeTab.index - 1)
        ?? tabs.find(t => t.index === tabs.length - 1);

    const nextTab = 
           tabs.find(t => t.index === activeTab.index + 1)
        ?? tabs.find(t => t.index === 0);

    if (direction === 'next')
        await chrome.tabs.update(nextTab.id, { active: true });
    else
        await chrome.tabs.update(prevTab.id, { active: true });
}