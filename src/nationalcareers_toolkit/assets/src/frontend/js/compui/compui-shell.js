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
    }
}

var compUiShell = new CompUiShell(
    [
        new DfcAppContactUs()
    ]);

compUiShell.initialise();