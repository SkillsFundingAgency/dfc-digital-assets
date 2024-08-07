﻿var cookiePrefrences = (function () {
    'use strict'
    window.GOVUK = window.GOVUK || {}

    var DEFAULT_COOKIE_CONSENT = {
        'essential': true,
        'usage': false,
    }

    var COOKIE_CATEGORIES = {
        'cookies_policy': 'essential',
        'cookies_preferences_set': 'essential',
        'ncs_hide_custom_banner': 'essential',

        // Google Analytics
        '_ga': 'usage',
        '_gid': 'usage',
        '_gat': 'usage',
        '_gat_UA-75241446-1': 'usage',
        '_gat_UA-75241446-2': 'usage',
        '_gat_UA-75241446-3': 'usage',
        '_gat_UA-75241446-4': 'usage',
        '_gat_UA-75241446-5': 'usage',
        '_gat_UA-75241446-6': 'usage',
        '_gat_UA-75241446-8': 'usage',
        '_gat_UA-75241446-9': 'usage',
        '_gat_UA-75241446-10': 'usage',
        '_gat_UA-75241446-13': 'usage',
        '_gat_UA-75241446-19': 'usage',

        // Application Insights
        'ai_user': 'usage',
        'ai_session': 'usage',

        // Microsoft Clarity
        '_clck' : 'usage',
        '_clsk' : 'usage',
        'CLID' : 'usage',
        'ANONCHK' : 'usage',
        'MR' : 'usage',
        'MUID' : 'usage',
        'SM' : 'usage',
    }

    /*
      Cookie methods
      ==============
      Usage:
        Setting a cookie:
        GOVUK.cookie('hobnob', 'tasty', { days: 30 });
        Reading a cookie:
        GOVUK.cookie('hobnob');
        Deleting a cookie:
        GOVUK.cookie('hobnob', null);
    */
    window.GOVUK.cookie = function (name, value, options) {
        if (typeof value !== 'undefined') {
            if (value === false || value === null) {
                return window.GOVUK.setCookie(name, '', { days: -1 })
            } else {
                // Default expiry date of 30 days
                if (typeof options === 'undefined') {
                    options = { days: 30 }
                }
                return window.GOVUK.setCookie(name, value, options)
            }
        } else {
            return window.GOVUK.getCookie(name)
        }
    }

    window.GOVUK.setDefaultConsentCookie = function () {
        window.GOVUK.setConsentCookie(DEFAULT_COOKIE_CONSENT)
    }

    window.GOVUK.approveAllCookieTypes = function () {
        var approvedConsent = {
            'essential': true,
            'usage': true,
        }

        window.GOVUK.setCookie('cookies_policy', JSON.stringify(approvedConsent), { days: 365 })
    }

    window.GOVUK.getConsentCookie = function () {
        var consentCookie = window.GOVUK.cookie('cookies_policy')
        var consentCookieObj

        if (consentCookie) {
            try {
                consentCookieObj = JSON.parse(consentCookie)
            } catch (err) {
                return null
            }

            if (typeof consentCookieObj !== 'object' && consentCookieObj !== null) {
                consentCookieObj = JSON.parse(consentCookieObj)
            }
        } else {
            return null
        }

        return consentCookieObj
    }

    window.GOVUK.setConsentCookie = function (options) {
        var cookieConsent = window.GOVUK.getConsentCookie()

        if (!cookieConsent) {
            cookieConsent = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT))
        }

        for (var cookieType in options) {
            cookieConsent[cookieType] = options[cookieType]

            // Delete cookies of that type if consent being set to false
            if (!options[cookieType]) {
                for (var cookie in COOKIE_CATEGORIES) {
                    if (COOKIE_CATEGORIES[cookie] === cookieType) {
                        window.GOVUK.deleteCookie(cookie)
                    }
                }
            }
        }

        window.GOVUK.setCookie('cookies_policy', JSON.stringify(cookieConsent), { days: 365 })
    }

    window.GOVUK.checkConsentCookieCategory = function (cookieName, cookieCategory) {
        var currentConsentCookie = window.GOVUK.getConsentCookie()

        // If the consent cookie doesn't exist, but the cookie is in our known list, return false
        if (!currentConsentCookie && COOKIE_CATEGORIES[cookieName]) {
            return false
        }

        currentConsentCookie = window.GOVUK.getConsentCookie()

        // Sometimes currentConsentCookie is malformed in some of the tests, so we need to handle these
        try {
            return currentConsentCookie[cookieCategory]
        } catch (e) {
            console.error(e)
            return false
        }
    }

    window.GOVUK.checkConsentCookie = function (cookieName, cookieValue) {
        // If we're setting the consent cookie OR deleting a cookie, allow by default
        if (cookieName === 'cookies_policy' || (cookieValue === null || cookieValue === false)) {
            return true
        }

        if (COOKIE_CATEGORIES[cookieName]) {
            var cookieCategory = COOKIE_CATEGORIES[cookieName]

            return window.GOVUK.checkConsentCookieCategory(cookieName, cookieCategory)
        } else {
            // Deny the cookie if it is not known to us
            return false
        }
    }

    window.GOVUK.setCookie = function (name, value, options) {
        if (window.GOVUK.checkConsentCookie(name, value)) {
            if (typeof options === 'undefined') {
                options = {}
            }

            var cookieString = name + '=' + value + '; path=/; domain=' + window.GOVUK.getDomain();
            if (options.days) {
                var date = new Date()
                date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
                cookieString = cookieString + '; expires=' + date.toGMTString()
            }
            if (document.location.protocol === 'https:') {
                cookieString = cookieString + '; Secure'
            }
            document.cookie = cookieString
        }
    }

    window.GOVUK.getCookie = function (name) {
        var nameEQ = name + '='
        var cookies = document.cookie.split(';')
        for (var i = 0, len = cookies.length; i < len; i++) {
            var cookie = cookies[i]
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length)
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length))
            }
        }
        return null
    }

    window.GOVUK.getCookieCategory = function (cookie) {
        return COOKIE_CATEGORIES[cookie]
    }

    window.GOVUK.deleteCookie = function (cookie) {
        window.GOVUK.cookie(cookie, null)

        if (window.GOVUK.cookie(cookie)) {
            //if its not a GA type cookie dont use the . for domain
            if (cookie.indexOf('_ga') === -1) {
                document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path =/'
            }
            else {
                document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.GOVUK.getDomain() + '; path=/'
            }
        }
    }

    window.GOVUK.deleteUnconsentedCookies = function () {
        var currentConsent = window.GOVUK.getConsentCookie()

        for (var cookieType in currentConsent) {
            // Delete cookies of that type if consent being set to false
            if (!currentConsent[cookieType]) {
                for (var cookie in COOKIE_CATEGORIES) {
                    if (COOKIE_CATEGORIES[cookie] === cookieType) {
                        window.GOVUK.deleteCookie(cookie)
                    }
                }
            }
        }
    }

    window.GOVUK.getDomain = function () {
        var domain = window.location.hostname;
        var index = domain.indexOf('nationalcareer');
        if (index === -1) {
            return domain
        }
        else {
            return ('.' + window.location.hostname.slice(index))
        }
    }

    window.GOVUK.setAnalyticsTrackingState = function () {

        var consentState = !window.GOVUK.checkConsentCookie('_gid', true)
        window['ga-disable-UA-75241446-1'] = consentState
        window['ga-disable-UA-75241446-2'] = consentState
        window['ga-disable-UA-75241446-3'] = consentState
        window['ga-disable-UA-75241446-4'] = consentState
        window['ga-disable-UA-75241446-5'] = consentState
        window['ga-disable-UA-75241446-6'] = consentState
        window['ga-disable-UA-75241446-8'] = consentState
        window['ga-disable-UA-75241446-9'] = consentState
        window['ga-disable-UA-75241446-10'] = consentState
        window['ga-disable-UA-75241446-13'] = consentState
        window['ga-disable-UA-75241446-19'] = consentState

        if (window.clarity && typeof window.clarity === 'function') {
            window.clarity(consentState ? 'stop' : 'consent');
        } else {
            console.error('Clarity is not defined or is not a function.');
        }

        if (window.appInsights && window.appInsights.config) {
            if (typeof window.appInsights.config.isCookieUseDisabled !== 'undefined') {
                window.appInsights.config.isCookieUseDisabled = !window.GOVUK.checkConsentCookie('ai_user', true)
            }
        }
    }

    window.GOVUK.setGAConsented = function () {
        window.GOVUK.setAnalyticsTrackingState()

        //Send the pageview event using the last tracker that was created to create a new tracker
        ga("create", ga.getAll()[ga.getAll().length - 1].get('trackingId'), { name: "ncs_tracker", cookieDomain: "auto" })
        ga("ncs_tracker.send", "pageview")
    }

    //set at load time
    window.GOVUK.setAnalyticsTrackingState()

    return {
       
        isCookiePrefrenceSet: function () {
            return window.GOVUK.cookie('cookies_preferences_set')
        },

        setDefault: function () {
            window.GOVUK.setConsentCookie();
            //give the browser time to set the cookies before acting on them
            setTimeout(function () { window.GOVUK.deleteUnconsentedCookies() }, 500)
            setTimeout(function () { window.GOVUK.setAnalyticsTrackingState() }, 1000)
        },

        updateConsentCookies: function (cookieSettings) {
            window.GOVUK.setConsentCookie(cookieSettings);
            window.GOVUK.setCookie('cookies_preferences_set', !0, { days: 365 });
            setTimeout(function () { window.GOVUK.setAnalyticsTrackingState() }, 500)
        },

        approveAll: function () {
            window.GOVUK.approveAllCookieTypes()
            window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
            setTimeout(function () { window.GOVUK.setGAConsented() }, 500)
        },

        readPolicyCookie: function () {
            return window.GOVUK.cookie('cookies_policy')
        },

        configureAppInsightsUsage: function () {
            if (window.appInsights !== 'undefined') {
                window.appInsights.config.isCookieUseDisabled = !window.GOVUK.checkConsentCookie('ai_user', true)
            }
        }       
    }
})()




