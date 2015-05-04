chrome.runtime.sendMessage("Nike Bot Online");


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	alert("Content script received = " + request.greeting);

});





function chooseMenuItem(menuItem)
{
	var items = $("li a.inline-facet.facet.js-facet.nsg-font-family--base.edf-font-size--regular");
	
	var index = 0;
	var target = 0;
		
		$.each(items, function(){ 

			var curr = $(this).text().trim();

			if(curr === menuItem)
			{
				//alert("Clicking " + curr);
				target = index;
				return false;
			}

			index++;
		});

	$(items)[target].click();

	setTimeout(chooseIndexShoe(3),5000);
}


function chooseIndexShoe(indexShoe)
{
	var items = $("div.grid-item.fullSize");

	var index = 0;
	var target = 0;

		$.each(items, function(){

			var tmp = $(this).children("div.grid-item-box").children("div.grid-item-content");
			var infoWrap = $(tmp).children("div.grid-item-info").children("div.product-name").children("p.product-display-name.nsg-font-family--base.edf-font-size--regular.nsg-text--dark-grey");
			var name = $(infoWrap).text();

			if(index === indexShoe)
			{
				target = index;
				//alert("Shoe name["+index+"] = " + name);

				// Agarrar url del show
				var url = $(tmp).children("div.grid-item-image").children("div.grid-item-image-wrapper.sprite-sheet").children("a").attr("href");

				//alert("url a redirect = " + url);
				window.open(url,"_self");

				return false;
			}	

			index++;
		});

	setTimeout(addToCart(),7000);
}

function addToCart()
{
	// Select size and add to cart
	var select = $("select[name='skuAndSize']").val("11522056:10.5");
	$("button#buyingtools-add-to-cart-button")[0].click();
}

