const state = new (class {
    #enabled;

    constructor() {
        this.#enabled = true;
        this.#updateBadge();
    }

    toggleEnabled() {
        this.#enabled = !this.#enabled;
        this.#updateBadge();
    }

    get enabled() {
        return this.#enabled;
    }

    #updateBadge() {
        chrome.action.setBadgeText({
            text: this.#enabled ? '✓' : '✗'
        });

        chrome.action.setBadgeBackgroundColor({
            color: this.#enabled ? 'green' : 'firebrick'
        });
    }
})();

chrome.action.onClicked.addListener(async (command) => {
    state.toggleEnabled();
});

chrome.commands.onCommand.addListener(async (command) => {
    if (!state.enabled)
        return;

    switch (command) {
        case "tab-next":
            tab('next');
            break;

        case "tab-previous":
            tab('previous');
            break;
    }
});

/*
    Activate next or previous tab.
*/

async function tab(direction = 'next') {
    const tabs      = await chrome.tabs.query({});
    const activeTab = tabs.find(t => t.active);

    if (activeTab == null || tabs.length == 1)
        return;

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