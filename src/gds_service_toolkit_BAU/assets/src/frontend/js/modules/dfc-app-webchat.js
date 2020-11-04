DfcAppWebchat = {
    initialise: function (webchatDomain) {
        $('a[href^="/webchat/chat"]').click(function (e) {
            if (typeof ChatRed != "undefined") {
                let chatRed = new ChatRed('NCS-Live', webchatDomain);
                chatRed.run();
                if (typeof window.botmanWidget != "undefined") {
                    e.preventDefault();
                    window.botmanWidget.open();
                }
            }
        });
    }
}
