$(document).ready(function () {

    //Only runn on settings page
    if ($("#form-cookie-settings").length) {
        $("#global-cookie-banner").hide();

        if (!window.GOVUK.cookie("cookies_preferences_set")) {
            window.GOVUK.setConsentCookie();
        }

        formCookiesInitalise();

        $("#form-cookie-settings").submit(function (t) {
            for (var e = t.target.getElementsByTagName("input"), n = {}, o = 0; o < e.length; o++) {
                var i = e[o];
                if (i.checked) {
                    var r = i.name.replace("cookies-", ""),
                        a = "on" === i.value;
                    n[r] = a
                }
            }
            window.GOVUK.setConsentCookie(n)
            window.GOVUK.setCookie("cookies_preferences_set", !0, { days: 365 });
            $("#cookie-settings-confirmation").show();
            window.scrollTo(0, 0);
            return false;
        });

        $("#cookie-settings-backto-previous").attr("href", document.referrer);

    }
});


function formCookiesInitalise() {
    var t = window.GOVUK.cookie("cookies_policy"),
        e = JSON.parse(t);
    for (var n in delete e.essential, e) {
        (e[n] ? document.querySelector("input[name=cookies-" + n + "][value=on]") : document.querySelector("input[name=cookies-" + n + "][value=off]")).checked = !0
    }
}