chrome.runtime.onInstalled.addListener(() =>
	chrome.tabs.query({}, tabs => tabs.forEach(({ id }) => {
		chrome.tabs.insertCSS(id, { file: 'basic.css' });
		chrome.tabs.executeScript(id, { file: 'contentscript.js' });
	}))
);
