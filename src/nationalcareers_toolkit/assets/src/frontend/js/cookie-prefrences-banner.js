$(document).ready(function () {
    var printHtml = '<button id="accept-all-cookies" class="govuk-button ncs-button__primary" type="button" data-module="track-click" data-accept-cookies="true" data-track-category="cookieBanner" data-track-action="Cookie banner accepted">Accept all cookies</button>';
    $('#accept-cookies-div').html(printHtml);

    if (!cookiePrefrences.isCookiePrefrenceSet()) {
        $('#cookie-message').show();
        $('#confirmatiom-message').hide();
    }

    // flip cookie preference setting if js enabled
    $(".cookie-settings__form-wrapper").show();
    $(".cookie-settings__no-js").hide();

    if (typeof cookiePrefrences === 'undefined') document.body.className = document.body.className.replace('js-enabled', '');

    //only run this is on non setting pages
    if ($('#form-cookie-settings').length === 0) {
        if (cookiePrefrences.isCookiePrefrenceSet()) {
            $('#global-cookie-banner').hide();
        }
        else {
            cookiePrefrences.setDefault();

            $('#accept-all-cookies').click(function () {
                cookiePrefrences.approveAll();
                $('#cookie-message').hide();
                $('#confirmatiom-message').show();
                $("#cookie-settings-confirmation").show();
                windows.location.reload();
            })

            $('#hide-cookies-message').click(function () {
                $('#global-cookie-banner').hide();
            });
        }
    }
});

