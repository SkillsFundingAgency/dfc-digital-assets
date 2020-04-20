$(document).ready(function () {

    if (typeof window.GOVUK === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');

    //only run this is on non setting pages
    if ($("#form-cookie-settings").length === 0) {
        if (GOVUK.cookie("cookies_preferences_set")) {
            $("#global-cookie-banner").hide();
        }
        else {
            //set defaults
            window.GOVUK.setConsentCookie();
            //give the browser time to set the cookies before acting on them
            setTimeout(function () { window.GOVUK.deleteUnconsentedCookies(); }, 500);
            setTimeout(function () { window.GOVUK.setGATracking(); }, 1000);
        }

        $("#accept-all-cookies").click(function () {

            window.GOVUK.approveAllCookieTypes();
            $("#cookie-message").hide();
            $("#confirmatiom-message").show();
            window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
            setTimeout(function () { window.GOVUK.setGATracking(); }, 1000);
        });

        $("#hide-cookies-message").click(function () {
            $("#global-cookie-banner").hide();
        });
    }
});


