class CompUiShell {
    constructor(allChildApps) {
        this.allChildApps = allChildApps;
    }

    initialise() {
        this.allChildApps.forEach(f => f.initialise());
    }
}

window.onload = void new CompUiShell([new DfcAppContactUs]).initialise();
