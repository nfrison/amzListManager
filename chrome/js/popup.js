window.onload = function() {
	document.getElementById('activate').addEventListener('click', activate);
}

function activate() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"type": "clicked_browser_action"});
	});
}