//Set default state based on ehlstateCookie
var ehlstateCookie = "ehlstateCookie";

$(document).ready(function () {
    var printHtml = '<button id="accept-all-cookies" class="govuk-button" type="button" data-module="track-click" data-accept-cookies="true" data-track-category="cookieBanner" data-track-action="Cookie banner accepted">Accept all cookies</button>';
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
            })

            $('#hide-cookies-message').click(function () {
                $('#global-cookie-banner').hide();
            });
        }
    }

    
    var ehlCookie = CookieBanner.getCookie(ehlstateCookie);
    if (ehlCookie === null) {

        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, true, 28);
        $("#ehl-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (ehlCookie === "true") {
        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, true, 28);
        $("#ehl-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (ehlCookie === "false") {
        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, false, 28);
        $("#ehl-hide-link").text("Show message");
        $('.ncs-toggle').hide();
    }

    //On click functionality
    $("#ehl-hide-link").click(function () {
        $(".ncs-toggle").slideToggle();
        if ($(this).text() === "Show message") {
            $(this).text("Hide message");

            // Update cookie status
            CookieBanner.setCookie(ehlstateCookie, true, 28);
        } else {
            $(this).text("Show message");
            // Update cookie status
            CookieBanner.setCookie(ehlstateCookie, false, 28);
        }
    });
});

