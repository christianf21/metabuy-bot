$(document).ready(function(){


	$("button#go").on("click", function(){
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

});