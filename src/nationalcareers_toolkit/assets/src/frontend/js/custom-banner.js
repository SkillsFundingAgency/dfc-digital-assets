/*
$(document).ready(function () {
 
    //only inject it on pages where its not there already
    if ($('.global-bar-message-container').length === 0) {
        var bannerHTML = `
            <div id="global-bar" class="global-bar global-bar--warning" role="region">
                <div class="global-bar-message-container">
                    <div class="global-bar-message"><span class="govuk-warning-text__icon" aria-hidden="true">!</span>
                        <strong class="govuk-warning-text__text"><span class="govuk-warning-text__assistive">Warning</span>
                            Exam Results Helpline
                        </strong>
                        <span class="ncs-toggle">
                        <span class="govuk-warning-text__text govuk-!-margin-top-1"> The National Careers Service can help you decide on your <a href="/get-a-job">post 16 and 18 options</a>.</span>
                        <span class="govuk-warning-text__text govuk-!-margin-top-1"> To speak to a careers adviser about your exam results call 0800 100 900, open 8am to 10pm, 7 days a week.</span></span>
                        <a id="custom-banner-hide-link" href="#" class="global-bar__dismiss global-bar__dismiss--show dismiss govuk-link dfc-link-black " role="button ">Hide message</a>
                    </div>
                </div>
            </div>`

        $('.govuk-header').after(bannerHTML);
    }
 

    //Set default state based on customBannerStatusCookie
    var customBannerStatusCookie = "ncs_hide_custom_banner";
    var customBannerCookie = window.GOVUK.getCookie(customBannerStatusCookie);

    if (customBannerCookie === "true") {
        $("#custom-banner-hide-link").text("Show message");
        $('.ncs-toggle').hide();
    }

   
    $(document).on('click', '#custom-banner-hide-link', function (event) {
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
*/