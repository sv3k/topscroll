/*
 * Chrome doesn't inject content scripts to existing tabs when extension is installed,
 * so we do that here manually. "scripting" permission is required just for that.
 * Firfox doesn't need this installer since it does the initial injecion for you.
 */
chrome.runtime.onInstalled.addListener(() =>
	chrome.tabs.query({}, tabs => tabs.forEach(({ id }) => {
		chrome.scripting.insertCSS({ target: { tabId: id }, files: ['basic.css'] });
		chrome.scripting.executeScript({ target: { tabId: id }, files: ['contentscript.js'] });
	}))
);
