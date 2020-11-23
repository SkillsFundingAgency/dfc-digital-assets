var CompUiShell = function () {
    this.validation = new CompUiValidation();
}

CompUiShell.prototype = {
    initialise: function () {
        this.validation.initialise();
    }
}

var compUiShell = new CompUiShell();

compUiShell.initialise();