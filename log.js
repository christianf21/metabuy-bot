
var data = "";

function readLog() {

    setTimeout(function() {
        readLog();
    }, 1000); 

    var log = localStorage["log"];

    if(log != data) {
        data = log;
        document.getElementById("log").innerHTML = log.replace(/\n/g, "<br/>");
    }

}

function reset() {

  chrome.extension.sendMessage({resetLog:""}, function(response) {
  });

}

document.getElementById("reset").onclick = function() {
    reset();
};

readLog();
