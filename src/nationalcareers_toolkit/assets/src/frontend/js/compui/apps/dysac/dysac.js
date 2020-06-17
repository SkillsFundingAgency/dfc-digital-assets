dysacAnalytics.init();
dysacBreadcrumbs.init();

if (dysacHelpers.isPage('app-page--results')) {
    dysacResults.short();
}

if (dysacHelpers.isPage('app-page--results-long')) {
    if (document.body.clientWidth >= 768) {
        dysacResults.cardHeight();
    }
    dysacResults.long();
}



$(document).ready(function () {
    compUiShell.validation.ShowErrorInPageTitle('dysac-validation-summary');

    $('#dysac-print-button').on('click', function () {
        window.print();
        return false;
    });

    $('#dysac-submit-button').on("click", function (e) {
        var form = $('#dysac-form');
        form.validate();
        var dysacValid = form.valid();
        if (!dysacValid) {
            $('.govuk-error-summary').find('li').each(function () {
                var txt = $(this).text();
                $(this).html('<li><a href="#code" class="govuk-link govuk-link--no-visited-state">' + txt + '</li>');
                let isInputText = $('#code').is('input:text');
                if (isInputText) {
                    $("#code").addClass('govuk-input--error');
                }
            });
            e.preventDefault();
            compUiShell.validation.ShowErrorInPageTitle('dysac-validation-summary');
            $('.validation-summary-errors').focus();
        }
    });
});