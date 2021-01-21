var ChatView = function () { }

ChatView.prototype = {
    initialise: function () {
        var paths = ["/webchat/chat", "/webchat/chat/", "/contact-us/chat", "/contact-us/chat/", "/pages/chat", "/pages/chat/"];

        if (paths.indexOf(window.location.pathname.toLowerCase()) > -1) {
            this.initialisChatView();
        }
    },

    initialisChatView: function () {
        $('.dfc-app-contact-us-IframeContainer').each(function () {
            var iFrameTag = "<iframe id='webchatframee' src='" + $(this).attr("data-chaturl") + "' title='Chatbot' class='dfc-app-contact-us-Webchat'></iframe>";
            $(this).append(iFrameTag);
        });
    }
}

var chatView = new ChatView();
chatView.initialise();
