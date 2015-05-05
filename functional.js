//chrome.runtime.sendMessage("Nike Bot Online");


/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	alert("Content script received = " + request.greeting);

});
*/

// Chooses any menu item from the store.nike.com
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

// Chooses a shoe on any specified index
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

// Sizes available: 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
function addToCart(size)
{
	var options = $("select[name='skuAndSize'] option");
	var target = "";

		$.each(options, function(){

			var tmps = $(this).text().trim();
			
				if(tmps === size)
				{
					target = $(this).val();
					return false;
				}
		});

	// Select size and add to cart
	$("select[name='skuAndSize']").val(target);
	$("button#buyingtools-add-to-cart-button")[0].click();
}

// Clicks on the cart, then clicks on checkout
function goToCheckout()
{
	$("div.exp-default.exp-cart-container.exp-cartcount-visible").children("a:first")[0].click();

	$("input#ch4_cartCheckoutBtn")[0].click();
}
