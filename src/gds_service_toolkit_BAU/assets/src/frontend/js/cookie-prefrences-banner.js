//Set default state based on customBannerStatusCookie
var customBannerStatusCookie = "customBannerStatusCookie";

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

    //Exam help line cookie banner functionality
    var customBannerCookie = CookieBanner.getCookie(customBannerStatusCookie);
    if (customBannerCookie === null) {

        //Set cookie
        CookieBanner.setCookie(customBannerStatusCookie, true, 28);
        $("#custom-banner-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (customBannerCookie === "true") {
        //Set cookie
        CookieBanner.setCookie(customBannerStatusCookie, true, 28);
        $("#custom-banner-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (customBannerCookie === "false") {
        //Set cookie
        CookieBanner.setCookie(customBannerStatusCookie, false, 28);
        $("#custom-banner-hide-link").text("Show message");
        $('.ncs-toggle').hide();
    }

    //On click functionality
    $("#custom-banner-hide-link").click(function () {
        $(".ncs-toggle").slideToggle();
        if ($(this).text() === "Show message") {
            $(this).text("Hide message");

            // Update cookie status
            CookieBanner.setCookie(customBannerStatusCookie, true, 28);
        } else {
            $(this).text("Show message");
            // Update cookie status
            CookieBanner.setCookie(customBannerStatusCookie, false, 28);
        }
    });
});


