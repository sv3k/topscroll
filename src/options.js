function saveOptions() {
	var type = document.getElementById('panel-type').value;
	var status = document.getElementById('saved');
	chrome.storage.sync.set({
		panelType: type
	}, () => {
		// Update status to let user know options were saved
		status.style.opacity = 1;
		setTimeout(() => {
			status.style.opacity = 0;
		}, 1000);
	});
}

function showOptions() {
	chrome.storage.sync.get({ panelType: 1 }, options => {
		document.getElementById('panel-type').value = options.panelType;
		var demo = document.getElementById('demo-text');
		demo.className = 'demo demo-' + options.panelType;
		demo.textContent = '← ' + chrome.i18n.getMessage('panelSize' + options.panelType + 'Desc');
	});
}

// Init locale-specific strings
document.getElementById('saved').textContent = "✓ " + chrome.i18n.getMessage('savedMsg');
document.getElementById('panel-size-title').textContent = chrome.i18n.getMessage('panelSizeTitle');
document.getElementById('panel-size-1').textContent = chrome.i18n.getMessage('panelSize1');
document.getElementById('panel-size-2').textContent = chrome.i18n.getMessage('panelSize2');

document.addEventListener('DOMContentLoaded', showOptions);
document.getElementById('panel-type').addEventListener('change', () => {
	saveOptions(); 
	showOptions();
});

// Make links work
window.addEventListener('click', e => {
	if (e.target.href !== undefined) {
		chrome.tabs.create({ url:e.target.href })
	}
});