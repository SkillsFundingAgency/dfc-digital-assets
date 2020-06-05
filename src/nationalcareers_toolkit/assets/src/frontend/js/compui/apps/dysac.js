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
            $('li').each(function () {
                var txt = $(this).text();
                $(this).html('<li><a href="#code" class="govuk-link govuk-link--no-visited-state">' + txt + '</li>');
                $("#code").addClass('govuk-input--error');
                $("#govuk-error-summary").focus();
            });
            e.preventDefault();
        }
    });
});