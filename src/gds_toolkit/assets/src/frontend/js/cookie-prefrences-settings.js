$(document).ready(function () {

    //Only runn on settings page
    if ($('#form-cookie-settings').length) {

        var firstSwitch = true;
        $('#global-cookie-banner').hide();

        if (!cookiePrefrences.isCookiePrefrenceSet()) {
            cookiePrefrences.setDefault()
        }

        formCookiesInitalise();

        $('#form-cookie-settings').submit(function(t) {firstSwitch = cookieSubmit(t, firstSwitch)});
        $('#form-cookie-settings').click(function(t) {firstSwitch = cookieSubmit(t, firstSwitch)});

        $('#form-cookie-settings').submit(function (t) {
            for (var e = t.target.getElementsByTagName('input'), n = {}, o = 0; o < e.length; o++) {
                var i = e[o];
                if (i.checked) {
                    var r = i.name.replace('cookies-', ''),
                        a = 'on' === i.value;
                    n[r] = a
                }
            }

            //Save the current consent for GA tracking
            var previousConsentState = window.GOVUK.checkConsentCookie('_gid', true)
            cookiePrefrences.updateConsentCookies(n)

            //if we have switched from not consented to consented for the first time on this page 
            if (!previousConsentState && n.usage === true && firstSwitch) {
                firstSwitch = false;
                setTimeout(function () { window.GOVUK.setGAConsented() }, 1000)
            }

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

function cookieSubmit(t, firstSwitch) {
    for (var e = document.getElementsByTagName('input'), n = {}, o = 0; o < e.length; o++) {
        var i = e[o];
        if (i.checked) {
            var r = i.name.replace('cookies-', ''),
                a = 'on' === i.value;
            n[r] = a
        }
    }

    //Save the current consent for GA tracking
    var previousConsentState = window.GOVUK.checkConsentCookie('_gid', true)
    cookiePrefrences.updateConsentCookies(n)

    //if we have switched from not consented to consented for the first time on this page 
    if (!previousConsentState && n.usage === true && firstSwitch) {
        firstSwitch = false;
        setTimeout(function () { window.GOVUK.setGAConsented() }, 1000)
    }

    window.location.reload();

    $('#cookie-settings-confirmation').show();
    window.scrollTo(0, 0);
    return firstSwitch;
}