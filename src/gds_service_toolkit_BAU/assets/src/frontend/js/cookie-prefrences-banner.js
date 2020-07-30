//Set default state based on ehlstateCookie
var ehlstateCookie = "ehlstateCookie";

$(document).ready(function () {

    if (typeof cookiePrefrences === 'undefined') document.body.className = document.body.className.replace('js-enabled', '')

    //only run this is on non setting pages
    if ($('#form-cookie-settings').length === 0) {
        if (cookiePrefrences.isCookiePrefrenceSet()) {
            $('#global-cookie-banner').hide()
        }
        else {
            cookiePrefrences.setDefault()

            $('#accept-all-cookies').click(function () {
                cookiePrefrences.approveAll()
                $('#cookie-message').hide()
                $('#confirmatiom-message').show()
            })

            $('#hide-cookies-message').click(function () {
                $('#global-cookie-banner').hide()
            })
        }
    }

    //Exam help lin cookie banner functionality
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


