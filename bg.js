var tabs = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	if(!containsTab(sender.tab.id))
		tabs.push(sender.tab.id);

	chrome.tabs.sendMessage(sender.tab.id, {
			size: localStorage["shoesize"],
			option: localStorage["radioOption"]
	});

});

function containsTab(id)
{
	var flag = false;


	for(var i = 0; i<tabs.length; i++)
	{
		if(id === tabs[i])
		{
			flag = true;
		}
	}

	return flag;
}