$(document).ready(function () {

    if (typeof window.GOVUK === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');

    //only run this is on non setting pages
    if ($("#form-cookie-settings").length === 0) {
        if (GOVUK.cookie("cookies_preferences_set")) {
            $("#global-cookie-message").hide();
        }
        else {
            //set defaults
            GOVUK.setConsentCookie();
        }

        $("#accept-all-cookies").click(function () {

            GOVUK.approveAllCookieTypes();
            $("#cookie-message").hide();
            $("#confirmatiom-message").show();
            window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
        });

        $("#hide-cookies-message").click(function () {
            $("#global-cookie-message").hide();
        });
    }
});