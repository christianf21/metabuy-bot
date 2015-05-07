chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
		if(request.resetLog !== undefined) 
		{
			localStorage["log"] = "";
		}

	if(request.status.trim() === "automatic-scan")
	{
		log("Requested automatic scan...");
		start();
	}

		if(request.status === "online")
		{
			log("functional.js sends ONLINE status...");
			chrome.tabs.sendMessage(sender.tab.id, {
					size: localStorage["shoesize"],
					option: localStorage["radioOption"]
			});
		}
});

function log(str) {

	var d = new Date();
	var time = d.toLocaleTimeString();

	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/&/g, "&amp;");

	localStorage["log"] += "[" + time + "] " + str + "\n";
}

var keywords = [];
var timer = null;
var interval = 1000;

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
		
		//timer = setInterval(run, interval);

		run();

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
			log("URL = " + url);
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