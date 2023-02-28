$('a[href^="/webchat/chat"]').click(function (e) {
    if (typeof window.ChatRedApi != "undefined") {
        window.ChatRedApi.open();
        e.preventDefault();
    }
});