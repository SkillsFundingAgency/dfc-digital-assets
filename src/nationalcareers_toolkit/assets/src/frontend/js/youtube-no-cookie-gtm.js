//enable the JavaScript API for an embedded player
for (var e = document.getElementsByTagName("iframe"), x = e.length; x--;)
if (/youtube-nocookie.com\/embed/.test(e[x].src))
if (e[x].src.indexOf('enablejsapi=') === -1)
e[x].src += (e[x].src.indexOf('?') === -1 ? '?' : '&') + 'enablejsapi=1';

var gtmYTListeners = [],
gtmYTListenersStates = []; // support multiple players on the same page
// attach our YT listener once the API is loaded
function onYouTubeIframeAPIReady() {
    for (var e = document.getElementsByTagName("iframe"), x = e.length; x--;) {
        if (/youtube-nocookie.com\/embed/.test(e[x].src)) {
    gtmYTListeners.push(new YT.Player(e[x],
        {
            events:
            {
                onError: onPlayerError,
                onReady: onPlayerReady
                //onStateChange: onPlayerStateChange
            }
        }));
            YT.gtmLastAction = "p";
        }
    }
}

function onPlayerReady(e) {
    var url = e.target.getVideoUrl();
    gtmYTListenersStates[url] = e.target.getPlayerState();

    setInterval(function () {
        var state = e.target.getPlayerState();

        if (gtmYTListenersStates[url] !== state) {
            e.data = state;
            onPlayerStateChange(e);
        }
        gtmYTListenersStates[url] = state;
    }, 100);
}

// listen for play, pause and end states
// also report % played every second
function onPlayerStateChange(e) {
    e["data"] == YT.PlayerState.PLAYING && setTimeout(onPlayerPercent, 1000, e["target"]);
    var video_data = e.target["getVideoData"](),
        label = video_data.title;
    // Get title of the current page
    var pageTitle = document.title;
    if (e["data"] == YT.PlayerState.PLAYING && YT.gtmLastAction == "p") {
    label = "Video Played - " + video_data.title;
        dataLayer.push(
            {
                'event': 'youtube',
                'eventCategory': 'Youtube Videos',
                'eventAction': pageTitle,
                'eventLabel': label
            });
        YT.gtmLastAction = "";
    }
    if (e["data"] == YT.PlayerState.PAUSED) {
    label = "Video Paused - " + video_data.title;
        dataLayer.push(
            {
                'event': 'youtube',
                'eventCategory': 'Youtube Videos',
                'eventAction': pageTitle,
                'eventLabel': label
            });
        YT.gtmLastAction = "p";
    }

}

// catch all to report errors through the GTM data layer
// once the error is exposed to GTM, it can be tracked in UA as an event!
function onPlayerError(e) {
    dataLayer.push(
        {
            'event': 'error',
            'eventCategory': 'Youtube Videos',
            'eventAction': 'GTM',
            'eventLabel': "youtube:" + e["target"]["src"] + "-" + e["data"]
        })
}

// report the % played if it matches 0%, 25%, 50%, 75% or completed
function onPlayerPercent(e) {
    console.log("onPlayerPercent");
    if (e["getPlayerState"]() == YT.PlayerState.PLAYING) {
        var t = e["getDuration"]() - e["getCurrentTime"]() <= 1.5 ? 1 : (Math.floor(e["getCurrentTime"]() / e

        ["getDuration"]() * 4) / 4).toFixed(2);
        if (!e["lastP"] || t > e["lastP"]) {
            var video_data = e["getVideoData"](),
                label = video_data.title;
            // Get title of the current page
            var pageTitle = document.title;
            e["lastP"] = t;
            label = t * 100 + "% Video played - " + video_data.title;
            dataLayer.push(
                {
                    'event': 'youtube',
                    'eventCategory': 'Youtube Videos',
                    'eventAction': pageTitle,
                    'eventLabel': label
                })
        }
        e["lastP"] != 1 && setTimeout(onPlayerPercent, 1000, e);
    }
}

// load the Youtube JS api and get going
var j = document.createElement("script"),
    f = document.getElementsByTagName("script")[0];
j.src = "//www.youtube.com/iframe_api";
j.async = true;
f.parentNode.insertBefore(j, f);
