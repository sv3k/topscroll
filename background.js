chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		code: 'document.getElementById("topscroll-chrome-extension-bar").click()'
	});
});