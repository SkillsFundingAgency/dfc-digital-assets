$(document).ready(function () {

    //Set default state based on customBannerStatusCookie
    var customBannerStatusCookie = "ncs_hide_custom_banner";
    var customBannerCookie = window.GOVUK.getCookie(customBannerStatusCookie);

    if (customBannerCookie === "true") {
        $("#custom-banner-hide-link").text("Show message");
        $('.ncs-toggle').hide();
    }
   
    $("#custom-banner-hide-link").click(function (event) {
        $(".ncs-toggle").slideToggle();
        if ($(this).text() === "Show message") {
            $(this).text("Hide message")
            window.GOVUK.setCookie(customBannerStatusCookie, false, {});
        } else {
            $(this).text("Show message")
            window.GOVUK.setCookie(customBannerStatusCookie, true, {});
        }
        event.preventDefault();
    });

});


