function setSurveyCookie(isTrue = true) {
    var date = new Date();
    //date.setTime(date.getTime() + (28 * 24 * 60 * 60 * 1000)); // This ia for the actual expiry outside for PROD (28 days)
    date.setTime(date.getTime() + (5 * 60 * 1000)); // This is for testing purposes (5mins)
    console.log(date.toUTCString());
    document.cookie = 'Survey=' + true + '; expires=' + date.toUTCString() + ';path=/'
}

console.log(CookieBanner.getCookie('Survey'));

if ((CookieBanner.getCookie('Survey') && document.getElementById('popupsurvey') != null)) {
    document.getElementById('popupsurvey').style.display = 'none'
};

if ((CookieBanner.getCookie('Survey') && document.getElementsByClassName('job-profile-feedback').length > 0)) {
    document.getElementsByClassName('job-profile-feedback').forEach(item => item.style.display = 'block')
};

document.querySelectorAll("#popupsurvey #exitbtn").forEach(item => item.addEventListener('click', function () {
    document.getElementById('popupsurvey').style.display = 'none';
    setSurveyCookie();
}));
document.querySelectorAll("#popupsurvey #btn").forEach(item => item.addEventListener('click', function () {
    this.parentElement.style.display = 'none';
    var nextpage = "survey" + this.getAttribute('name');
    document.getElementById(nextpage).style.display = 'inline';
    setSurveyCookie();
    //sessionStorage.setItem('Survey', true);
}));

if ((sessionStorage.getItem('extendedSurvey') && document.getElementById('extendedsurvey') != null)) {
    document.getElementById('extendedsurvey').style.display = 'none'
}
else if (document.getElementById('extendedsurvey') != null) { document.getElementById('extendedsurvey').style.display = 'block' };

document.querySelectorAll("#extendedexitbtn").forEach(item => item.addEventListener('click', function () {
    document.getElementById('extendedsurvey').style.display = 'none'
    sessionStorage.setItem('extendedSurvey', true);
}));
document.querySelectorAll("#extendedbtn").forEach(item => item.addEventListener('click', function () {
    this.parentElement.style.display = 'none';
    var nextpage = "survey" + this.getAttribute('name');
    document.getElementById(nextpage).style.display = 'inline';
    sessionStorage.setItem('extendedSurvey', true);
}));