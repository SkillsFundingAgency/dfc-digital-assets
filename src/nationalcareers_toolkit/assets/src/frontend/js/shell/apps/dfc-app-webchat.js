$('a[href^="/webchat/chat"]').click(function (e) {
    if (typeof ChatRed != "undefined" && typeof window.botmanChatWidget != "undefined") {
        window.botmanChatWidget.open();
        e.preventDefault();
    }
});