chrome.runtime.onInstalled.addListener(details => {
	chrome.tabs.query({}, tabs => {
		for (var i = 0; i < tabs.length; i++) {
			chrome.tabs.insertCSS(
				tabs[i].id,
				{ file: 'basic.css' }
			);
			chrome.tabs.executeScript(
				tabs[i].id,
				{ file: 'contentscript.js' }
			);
		}
	});
});

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.executeScript({ code: 'document.getElementById("topscroll-chrome-extension-bar").click();' });
});