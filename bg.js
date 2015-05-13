var keywords = [];
var timer = null;
var interval = 1000;

localStorage['validBot'] = 0;
checkValidation();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
	if(request.resetLog !== undefined) 
	{
		localStorage["log"] = "";
	}

	if(request.status.trim() === "validate-bot")
	{
		log("Requested bot validation...");

		var user = request.user;
		var pass = request.pass;

		contactServer(user,pass,sender);
	}

			// Automatic scan requests here
			if(request.status.trim() === "automatic-scan")
			{
				log("Requested automatic scan...");
				
				if(localStorage['validBot'] == 1)
					start();
				else
				{
					log("You need to activate the bot to be able to use its features...");
					alert("You need to activate the bot to be able to use its features...");
				}
			}

			// Stop scan requests here
			if(request.status.trim() === "stop-scan")
			{
				log("Requested STOP scan...");
				clearInterval(timer);
			}

			// This is where the content script comes to play with the background
			if(request.status === "online")
			{
				log("Injection script ONLINE...");
				chrome.tabs.sendMessage(sender.tab.id, {
						size: localStorage["shoesize"],
						option: localStorage["radioOption"]
				});
			}

});


function checkValidation()
{
	if(localStorage['validBot'] == 1)
	{
		// valid
	}
	else
	{
		// need user to login
		chrome.tabs.create({'url': chrome.extension.getURL('validate.html')});
	}
}

// Deprecated function
function validate(pass)
{
	var salt = "qwjioje23423idjw1231234e837jqhwjq";
	var check = "b19f5205ea181f90a1278e39110d2a5c";

	var input = CryptoJS.MD5(salt+pass).toString();

	if(input === check)
	{
		return true;
	}
	else
		return false;
}

function contactServer(user,pass,sender)
{
	log("Cross-checking account with server...");

	$.ajax({
				url: 'http://nullwriter.com/bot/validateBot?u='+user+'&p='+pass,
				type: "GET",
				success: function(data){
					log("Sucess contacting server...");

					var json = jQuery.parseJSON(data);

					if(json.valid == "1" || json.valid == 1)
					{
						log("Bot is active!");
						localStorage['validBot'] = 1;
						chrome.tabs.sendMessage(sender.tab.id, {
							status: "validation-response",
							flag: "valid"
						});
					}
					else
					{
						log("Bot was not activated!");
						chrome.tabs.sendMessage(sender.tab.id, {
							status: "validation-response",
							flag: "not"
						});
					}
				},
				error: function(xhr, textStatus, err) {
					log("AJAX request failed: " + err +","+ textStatus +","+ xhr);
				}
		});
}

function log(str) {

	var d = new Date();
	var time = d.toLocaleTimeString();

	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/&/g, "&amp;");

	localStorage["log"] += "[" + time + "] " + str + "\n";
}


function start() {

	var kwStr = localStorage["keywords"];
	var date = (new Date).toLocaleDateString();
	var d = new Date();
	var time = d.toLocaleTimeString();

	log("Bot starting at " + date + "  " + time);

	if(kwStr !== undefined && kwStr.length > 0) 
	{

		keywords = kwStr.split(",");

		log("Using keywords ["+localStorage["keywords"]+"]");
		
		timer = setInterval(run, interval);
	} 
	else
		log("Stopping. No keywords defined.");
}

function run() {
	log("Running...");

	// In case user didnt input twitter username....
		if(localStorage['twitter'] === undefined)
		{
			localStorage['twitter'] = 'nikestore';
		}

	try 
	{
		var account = localStorage['twitter'];
		log("Checking twitter @"+account);

		$.ajax({
				url: 'https://twitter.com/i/profiles/show/' + account + '/timeline?since_id=' + 0,
				type: "GET",
				success: getLatestTweet,
				error: function(xhr, textStatus, err) {
					log("AJAX request failed: " + err +","+ textStatus +","+ xhr);
					//if(enabled)
						//setTimeout(run, interval);
				},
				complete: function(jqXHR, textStatus) {
					//if(enabled)
					//setTimeout(run, interval);
				}
		});

	} 
	catch(err) 
	{
		log("run() ERROR: " + err.message);
		//run();
	}
}


function getLatestTweet(data)
{
	log("Retrieving the latest tweet...");

	var html = data.items_html;
	html = html.replace(/’/g, "'");

	//log("latest tweet is = " + html);

	var stIndex = html.indexOf('dir="ltr" data-aria-label-part="0"');
	var enIndex = html.indexOf('class="js-tweet-details-fixer tweet-details-fixer"',stIndex);

	//log("start index = " + stIndex + ", end index = " + enIndex);

	var tweet = html.substring(stIndex, enIndex);
	
	// Here we should check this tweet if it contains the keywords, if not, move to the tweet below...how?
	// We start the substring index as the enIndex and thats how we go...

		if(isTargetTweet(tweet))
		{
			var url = retrieveUrlFromTweet(tweet);
			log("Apparent URL = " + url);
			log("Now opening in new tab...");
			clearInterval(timer);
			window.open(url,"_blank");
		}
		else
		{
			log("Tweet is not target tweet, will continue scanning for new tweets...");
		}
}

// Is it a Very Important Tweet
function isTargetTweet(tweet)
{
	log("Checking if tweet meets keyword criteria...");

	var flag = false;
	var tweetStr = tweet.toLowerCase();
	var keysize = keywords.length;
	var checkCount = 0;

		for(var i = 0; i<keysize; i++)
		{
			var testie = keywords[i].toLowerCase();

			if(tweetStr.indexOf(testie) >= 0)
			{
				// Matches a keyword
				checkCount++;
			}

		}

	if(checkCount >= keysize)
	{
		log("Tweet matches keywords, we will retrieve url and process...");
		flag = true;
	}

	return flag;
}

function retrieveUrlFromTweet(tweet)
{
	// url is inside data-expanded-url="url here" followed by class="twitter-timeline-link"
	var stIndex = tweet.indexOf('data-expanded-url="') + String('data-expanded-url="').length;
	var enIndex = tweet.indexOf('class="twitter-timeline-link"') - 2;

	return tweet.substring(stIndex,enIndex);
}