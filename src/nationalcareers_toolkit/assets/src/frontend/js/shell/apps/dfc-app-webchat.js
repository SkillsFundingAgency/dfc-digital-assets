var DfcAppWebchat = function () {
}

DfcAppWebchat.prototype = {
    initialise: function (shellWebchatDomain) {
        $('a[href^="/webchat/chat"]').click(function (e) {
            if (typeof ChatRed != "undefined") {
                let chatRed = new ChatRed('NCS-Live', shellWebchatDomain);
                chatRed.run();
                if (typeof window.botmanWidget != "undefined") {
                    e.preventDefault();
                    window.botmanWidget.open();
                }
            }
        });
    }
}
