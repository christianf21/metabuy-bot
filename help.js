$(document).ready(function(){


	$("#gotit").on("click",function(){
		window.close();
	});

	$("#help-log").on("click",function(){
		chrome.tabs.create({ url: chrome.extension.getURL("log.html") });
	});


});