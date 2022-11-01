if ((localStorage.getItem('Survey') && document.getElementById('popupsurvey') != null)) {
    document.getElementById('popupsurvey').style.display = 'none'
};
//else if (document.getElementById('popupsurvey') != null) { document.getElementById('popupsurvey').style.display = 'flex' };

if ((localStorage.getItem('Survey') && document.getElementsByClassName('job-profile-feedback').length > 0)) {
    document.getElementsByClassName('job-profile-feedback').forEach(item => item.style.display = 'block')
};

document.querySelectorAll("#popupsurvey #exitbtn").forEach(item => item.addEventListener('click', function () {
    document.getElementById('popupsurvey').style.display = 'none'
    localStorage.setItem('Survey', true);
}));
document.querySelectorAll("#popupsurvey #btn").forEach(item => item.addEventListener('click', function () {
    this.parentElement.style.display = 'none';
    var nextpage = "survey" + this.getAttribute('name');
    document.getElementById(nextpage).style.display = 'inline';
    localStorage.setItem('Survey', true);
}));

if ((localStorage.getItem('extendedSurvey') && document.getElementById('extendedsurvey') != null)) {
    document.getElementById('extendedsurvey').style.display = 'none'
}
else if (document.getElementById('extendedsurvey') != null) { document.getElementById('extendedsurvey').style.display = 'block' };

document.querySelectorAll("#extendedexitbtn").forEach(item => item.addEventListener('click', function () {
    document.getElementById('extendedsurvey').style.display = 'none'
    localStorage.setItem('extendedSurvey', true);
}));
document.querySelectorAll("#extendedbtn").forEach(item => item.addEventListener('click', function () {
    this.parentElement.style.display = 'none';
    var nextpage = "survey" + this.getAttribute('name');
    document.getElementById(nextpage).style.display = 'inline';
    localStorage.setItem('extendedSurvey', true);
}));