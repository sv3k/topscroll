chrome.runtime.onInstalled.addListener(function(details) {
	chrome.tabs.query({}, function(tabs) {
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

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.executeScript({ code: 'document.getElementById("topscroll-chrome-extension-bar").click();' });
});