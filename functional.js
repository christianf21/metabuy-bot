chrome.runtime.sendMessage({status:"online"});

// Any message that it receives, its because the script is online. If the script is online, it means we have opened the store.nike.com
// and that only means we already want to add to cart. So we request for the shoe size.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		addToCart(request.size);
});


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
}

// Selects size and adds to cart. Sizes available: 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12
function addToCart(size)
{
	var options = $("select[name='skuAndSize'] option");
	var target = "";
	var found = false;

		$.each(options, function(){

			var tmps = $(this).text().trim();
			
				if(tmps === size)
				{
					if(!$(this).hasClass("selectBox-disabled"))
					{
						target = $(this).val();
						found = true;
						return false;
					}
					else
					{
						// Need to try next best size
						var msg = "Size "+size+" not available, will try next available size...";
						chrome.runtime.sendMessage({status:"log",logtext:msg});

						var sizeint = parseInt(size);

						if(size < 9 && size > 6)
						{
							addToCart(size+1);
						}
						else if(size > 9 && size <= 12)
						{
							addToCart(size-1);
						}
						else
						{
							var msg = "Cant find available sizes, hurry up and type out an available size in the settings...Will stop scan.";
							chrome.runtime.sendMessage({status:"log",logtext:msg});

							chrome.runtime.sendMessage({status:"stop-scan"});
						}


					}
				}
		});

	if(found)
	{
		// Select size and add to cart
		$("select[name='skuAndSize']").val(target);
		$("button#buyingtools-add-to-cart-button")[0].click();
		goToCheckout();
	}
}

// Clicks on the cart (to go to the cart page), and then clicks on checkout
function goToCheckout()
{
	$("div.exp-default.exp-cart-container.exp-cartcount-visible").children("a:first")[0].click();

	$("input#ch4_cartCheckoutBtn")[0].click();
}
