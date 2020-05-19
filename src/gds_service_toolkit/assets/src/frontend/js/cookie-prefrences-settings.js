$(document).ready(function () {

    //Only runn on settings page
    if ($('#form-cookie-settings').length) {
        $('#global-cookie-banner').hide();

        if (!cookiePrefrences.isCookiePrefrenceSet()) {
            cookiePrefrences.setDefault()
        }

        formCookiesInitalise();

        $('#form-cookie-settings').submit(function (t) {
            for (var e = t.target.getElementsByTagName('input'), n = {}, o = 0; o < e.length; o++) {
                var i = e[o];
                if (i.checked) {
                    var r = i.name.replace('cookies-', ''),
                        a = 'on' === i.value;
                    n[r] = a
                }
            }
            cookiePrefrences.updateConsentCookies(n)
             $('#cookie-settings-confirmation').show();
            window.scrollTo(0, 0);
            return false;
        });

        $("#cookie-settings-backto-previous").click(function () {
            window.history.back();
        });
    }
});


function formCookiesInitalise() {
    var t = cookiePrefrences.readPolicyCookie(),
        e = JSON.parse(t);
    for (var n in delete e.essential, e) {
        (e[n] ? document.querySelector('input[name=cookies-' + n + '][value=on]') : document.querySelector('input[name=cookies-' + n + '][value=off]')).checked = !0
    }
}