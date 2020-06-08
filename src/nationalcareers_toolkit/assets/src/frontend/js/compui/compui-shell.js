class CompUiShell {
    constructor(allChildApps) {
        this.allChildApps = allChildApps;

        this.validation = new CompUiValidation();
    }

    initialise() {
        this.validation.initialise();
        this.allChildApps.forEach(f => f.initialise());
    }

    get Validation() {
        return this.validation;
    }
}

var compUiShell = new CompUiShell(
    [
        new DfcAppContactUs()
    ]);

window.onload = compUiShell.initialise();
