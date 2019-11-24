window.onload = function() {
	document.getElementById('activate').addEventListener('click', activate);
	document.getElementById('reset').addEventListener('click', reset);
	document.getElementById('deactivate').addEventListener('click', deactivate);
}

function activate() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"type": "activate"});
	});
}

function reset() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"type": "reset"});
	});
}

function deactivate() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"type": "deactivate"});
	});
}