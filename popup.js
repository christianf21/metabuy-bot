$(document).ready(function(){
localStorage["radioOption"] = "automatic"; // default option when starting the extension
loadSettings();

	$("button#go").on("click", function(){
		
		var option =  $("input[name='typeSearch']:checked").val().trim();

			if(option === "direct")
			{
				var link = $("#directLink").val();
				saveSettings();
				window.open(link,"_blank");
			}
			else
			{
				chrome.runtime.sendMessage({status:"automatic-scan"});
				saveSettings();
			}

		window.close();
	});


	$("input[name='typeSearch']").on("change", function(){

		var curr = $(this).val().trim(); // automatic or direct
		
		if(curr === "direct")
			$("button#go").text("Go Now!");
		else
			$("button#go").text("Update Settings");

	});

	$("a#log").on("click", function(){
		chrome.tabs.create({ url: chrome.extension.getURL("log.html") });
	});


	function loadSettings()
	{
		if(localStorage["shoesize"] !== undefined)
		{
			$("input#shoeSize").val(localStorage["shoesize"]);
		}

		if(localStorage["keywords"] !== undefined)
		{
			$("input#shoeName").val(localStorage["keywords"]);
		}

		if(localStorage["radioOption"] !== undefined)
		{
			if(localStorage["radioOption"] === "automatic")
			{
				$("input#automatic").prop("checked",true);
				$("button#go").text("Update Settings");
			}
			else
			{
				$("input#direct").prop("checked",true);
				$("button#go").text("Go Now!");
			}
		}

		if(localStorage["link"] !== undefined)
		{
			$("#directLink").val(localStorage["link"]);
		}
	}

	function saveSettings()
	{
		localStorage["shoesize"] = $("input#shoeSize").val();
		localStorage["keywords"] = $("input#shoeName").val();
		localStorage["radioOption"] = $("input[name='typeSearch']:checked").val().trim();
		localStorage["link"] = $("#directLink").val();
	}

});