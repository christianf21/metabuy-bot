$(document).ready(function(){

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		
		if(request.status.trim() == "validation-response")
		{
			if(request.flag == "valid")
			{
				alert("Bot is Active!");
				chrome.tabs.create({ url: chrome.extension.getURL("log.html") });
				window.close();
			}
			else
			{
				$("#error-msg").text("Wrong username or password");
			}
		}

	});


	$("#validate_login").on("click",function(){
		chrome.runtime.sendMessage({
			status:"validate-bot",
			user:$("#username").val(),
			pass:$("#password").val()
		});
	});


});