$(document).ready(function () {

    //Set default state based on customBannerStatusCookie
    var customBannerStatusCookie = "ncs_hide_custom_banner";
    var customBannerCookie = CookieBanner.getCookie(customBannerStatusCookie);

    if (customBannerCookie === "true") {
        $("#custom-banner-hide-link").text("Show message");
        $('.ncs-toggle').addClass("toggled");
    }

    $("#custom-banner-hide-link").click(function (event) {
        $(".ncs-toggle").toggleClass("toggled");
        if ($(this).text() === "Show message") {
            $(this).text("Hide message");
            CookieBanner.setCookie(customBannerStatusCookie, false, {});
        } else {
            $(this).text("Show message");
            CookieBanner.setCookie(customBannerStatusCookie, true, {});
        }
        event.preventDefault();
    });

});
