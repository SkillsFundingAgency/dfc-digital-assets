if ((sessionStorage.getItem('Survey') && document.getElementById('popupsurvey') != null)) {
    document.getElementById('popupsurvey').style.display = 'none'
};
//else if (document.getElementById('popupsurvey') != null) { document.getElementById('popupsurvey').style.display = 'flex' };

if ((sessionStorage.getItem('Survey') && document.getElementsByClassName('job-profile-feedback').length > 0)) {
    document.getElementsByClassName('job-profile-feedback').forEach(item => item.style.display = 'block')
};

document.querySelectorAll("#popupsurvey #exitbtn").forEach(item => item.addEventListener('click', function () {
    document.getElementById('popupsurvey').style.display = 'none'
    sessionStorage.setItem('Survey', true);
}));
document.querySelectorAll("#popupsurvey #btn").forEach(item => item.addEventListener('click', function () {
    this.parentElement.style.display = 'none';
    var nextpage = "survey" + this.getAttribute('name');
    document.getElementById(nextpage).style.display = 'inline';
    sessionStorage.setItem('Survey', true);
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