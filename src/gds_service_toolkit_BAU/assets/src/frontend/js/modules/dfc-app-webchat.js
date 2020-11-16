var DfcAppWebchat = function () {
}

DfcAppWebchat.prototype = {
    initialise: function (webchatDomain) {
        var chatRed = new ChatRed('NCS-Live', shellWebchatDomain);
        chatRed.run();
        $('a[href^="/webchat/chat"]').click(function (e) {
            if (typeof ChatRed != "undefined") {
                if (typeof window.botmanChatWidget != "undefined") {
                    e.preventDefault();
                    window.botmanChatWidget.open();
                }
            }
        });
    }
}
