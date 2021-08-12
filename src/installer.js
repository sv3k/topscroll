chrome.runtime.onInstalled.addListener(() =>
	chrome.tabs.query({}, tabs => tabs.forEach(({ id }) => {
		chrome.scripting.insertCSS({ files: ['basic.css'], target: { tabId: id }});
		chrome.scripting.executeScript({ files: ['contentscript.js'], target: { tabId: id }});
	}))
);
