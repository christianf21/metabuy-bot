/*
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){

	alert("Background script = " + response + ", tab id = " + sender.tab.id);
	
	chrome.tabs.sendMessage(sender.tab.id, {greeting: "hello world from server"});
});*/

