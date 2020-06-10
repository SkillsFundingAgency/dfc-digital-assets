//analytics.init();
//breadcrumbs.init();

//if (helpers.isPage('app-page--results')) {
//    results.short();
//}

//if (helpers.isPage('app-page--results-long')) {
//    if (document.body.clientWidth >= 768) {
//        results.cardHeight();
//    }
//    results.long();
//}

$('#dysac-validation-summary').ready(function () {
    var form = $('#dysac-form');
    form.validate();
    var dysacValid = form.valid();
    if (!dysacValid) {
        compUiShell.validation.ShowErrorInPageTitle('dysac-validation-summary');
    }
});

$(document).ready(function () {
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
                $("#code").addClass('govuk-input--error');
            });
            e.preventDefault();
            compUiShell.validation.ShowErrorInPageTitle('dysac-validation-summary');
            $('.validation-summary-errors').focus();
        }
    });
});