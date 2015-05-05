$(document).ready(function(){


	$("button#go").on("click", function(){
		
		var option =  $("input[name='typeSearch']:checked").val().trim();

			if(option === "direct")
			{
				var link = $("#directLink").val();
				alert("Link to go = " + link);
			}
			else
				saveSettings();

		window.close();
	});


	$("input[name='typeSearch']").on("change", function(){

		var curr = $(this).val().trim(); // automatic or direct
		
		if(curr === "direct")
		{
			$("button#go").text("Go Now!");
		}
		else
			$("button#go").text("Update Settings");

	});


	function loadSettings()
	{

	}

	function saveSettings()
	{

	}

});