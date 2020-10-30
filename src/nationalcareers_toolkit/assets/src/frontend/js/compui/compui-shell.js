var CompUiShell = function (allChildApps) {
    this.allChildApps = allChildApps;

    this.validation = new CompUiValidation();
}

CompUiShell.prototype = {
    initialise: function () {
        this.validation.initialise();

        this.allChildApps.forEach(function (app) {
            app.initialise();
        });
    },

    activateWebChat: function (shellWebchatDomain) {
        this.dfcAppWebchat = new DfcAppWebchat();
        this.dfcAppWebchat.initialise(shellWebchatDomain);
    }
}

var compUiShell = new CompUiShell(
    [
        new DfcAppContactUs()
    ]);

compUiShell.initialise();