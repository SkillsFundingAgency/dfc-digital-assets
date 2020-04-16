$(document).ready(function () {

    if (typeof window.GOVUK === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');

    if (GOVUK.cookie("cookies_preferences_set")) {
        $("#global-cookie-message").hide();
    }
    else {
        //set defaults
        GOVUK.setConsentCookie();
    }

    $("#accept-all-cookies").click(function () {

        GOVUK.approveAllCookieTypes();
        $("#confirmatiom-message").show();
        window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
    });

    $("#hide-cookies-message").click(function () {
        $("#global-cookie-message").hide();
    });
});
