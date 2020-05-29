analytics.init();
breadcrumbs.init();

if (helpers.isPage('app-page--results')) {
    results.short();
}

if (helpers.isPage('app-page--results-long')) {
    if (document.body.clientWidth >= 768) {
        results.cardHeight();
    }
    results.long();
}

$(document).ready(function () {
    $('#dysac-print-button').on('click', function () {
        window.print();
        return false;
    });

    $('input[name="ReferenceCode"]').on("", function () {
        var validator = $("#dysac-form").validate();
        validator.resetForm();
    });
});