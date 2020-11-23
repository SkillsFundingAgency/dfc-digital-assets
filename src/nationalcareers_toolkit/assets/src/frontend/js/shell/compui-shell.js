var CompUiShell = function () {
    this.validation = new CompUiValidation();
}

CompUiShell.prototype = {
    initialise: function () {
        this.validation.initialise();
    },

    activateWebChat: function (shellWebchatDomain) {
        if (typeof DfcAppWebchat != "undefined") {
            this.dfcAppWebchat = new DfcAppWebchat();
            this.dfcAppWebchat.initialise(shellWebchatDomain);
        }
    }
}

var compUiShell = new CompUiShell();

compUiShell.initialise();