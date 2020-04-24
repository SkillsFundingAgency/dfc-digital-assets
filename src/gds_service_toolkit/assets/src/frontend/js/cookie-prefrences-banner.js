$(document).ready(function () {

    if (typeof cookieprefrences === 'undefined') document.body.className = document.body.className.replace('js-enabled', '')

    //only run this is on non setting pages
    if ($('#form-cookie-settings').length === 0) {
        if (cookieprefrences.isCookiePrefrenceSet()) {
            $('#global-cookie-banner').hide()
        }
        else {
            cookieprefrences.setDefault()

            $('#accept-all-cookies').click(function () {
                cookieprefrences.approveAll()
                $('#cookie-message').hide()
                $('#confirmatiom-message').show()
            })

            $('#hide-cookies-message').click(function () {
                $('#global-cookie-banner').hide()
            })
        }
    }
})


