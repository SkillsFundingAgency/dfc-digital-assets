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
                window.clarity('consent');
                $('#cookie-message').hide()
                $('#confirmatiom-message').show()
            })

            $('#hide-cookies-message').click(function () {
                $('#global-cookie-banner').hide()
            })
        }
    }
});


