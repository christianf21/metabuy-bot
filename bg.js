var tabs = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
		if(request.resetLog !== undefined) 
		{
			localStorage["log"] = "";
		}

	if(request.status.trim() === "automatic-scan")
	{
		log("requested automatic scan...");
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

function log(str) {

	var d = new Date();
	var time = d.toLocaleTimeString();

	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/&/g, "&amp;");

	localStorage["log"] += "[" + time + "] " + str + "\n";

}

var totalWords = 0;
var checkoutTab = -1;
var since = 0; //get tweets posted after this ID.
var immuneTabs = [];
var oldUrls = [];
var keywords = [];
var timer = null;
var excludeStr = "";
var readyTabs = 0;
var interval = 1000;
var getTweetsTime = "";
var getTweetsTotal = 0;
var logSince = 0;

function start() {
	log("Start() activated...");

	var kwStr = localStorage["keywords"];

	var date = (new Date).toLocaleDateString();
	log("Starting bot - " + date);

	if(kwStr !== undefined && kwStr.length > 0) {
		log("inside if...");
		
		oldUrls = [];

		log("after orlUrls");

		keywords = kwStr.split(",");

		log("afte rkeywords get...["+localStorage["keywords"]+"]");

		readyTabs = 0;
		totalWords = keywords.length;
		checkoutTab = -1;
		since = 0;
		tabs = [];
		immuneTabs = [];
		//timer = setInterval(run, interval);
		
		run();

	} else
		log("Stopping. No keywords defined.");
}

function run() {
	log("on the RUN() method");

	try {
		log("checking...twitter...");
		var account = 'nikestore';

		$.ajax({
				url: 'https://twitter.com/i/profiles/show/' + account + '/timeline?since_id=' + since,
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

		log("finished ajax...");
	} catch(err) {
		log("run() ERROR: " + err.message);
		//run();
	}
}


function getLatestTweet(data)
{
	log("retrieving latest tweet JSON...");

	var html = data.items_html;
	html = html.replace(/’/g, "'");

	//log("latest tweet is = " + html);

	var stIndex = html.indexOf('dir="ltr" data-aria-label-part="0"');
	var enIndex = html.indexOf('class="js-tweet-details-fixer tweet-details-fixer"',stIndex);

	log("start index = " + stIndex + ", end index = " + enIndex);

	var tweet = html.substring(stIndex, enIndex);
	
	//log("latest tweet = " + tweet);

	var url = retrieveUrlFromTweet(tweet);
}

function retrieveUrlFromTweet(tweet)
{
	// url is inside data-expanded-url="url here" followed by class="twitter-timeline-link"
	var stIndex = tweet.indexOf('data-expanded-url="');
	var enIndex = tweet.indexOf('class="twitter-timeline-link"') - 2;

	var url = tweet.substring(stIndex,enIndex);

	log("The tweets url is = " + url);
}

// Get the latest tweet
function getTweets(data) {

	log("Retrieving tweets...");

	try {

			if(data.items_html !== '')
			{
				log("data items_html is not undefined...");
				getTweetsTime = (new Date()).toLocaleTimeString();
				getTweetsTotal++;

				var html = data.items_html;
				html = html.replace(/’/g, "'");

				log("html 'cleaned' = " + html);

				var urls = getUrls(html);
			}
				

		} catch(err) {
			log("getTweets() ERROR: " + err.message);
			run();
		}

}
