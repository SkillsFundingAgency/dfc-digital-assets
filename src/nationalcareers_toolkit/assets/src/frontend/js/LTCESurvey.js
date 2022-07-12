//This JavaScript is the functionality for the next page and exit page buttons on the LTCE popup surveys
var survey = localStorage.getItem('Survey');
if(survey){
document.getElementById('popupsurvey').style.display = 'none'}
else{document.getElementById('popupsurvey').style.display = 'block'};
document.querySelectorAll("#exitbtn").forEach(item => item.addEventListener('click', function(){
        document.getElementById('popupsurvey').style.display = 'none'
        localStorage.setItem('Survey',true);
    }));
document.querySelectorAll("#btn").forEach(item => item.addEventListener('click', function(){
    this.parentElement.style.display = 'none';
    var nextpage = "survey" +this.getAttribute('name');
    document.getElementById(nextpage).style.display='inline';
    localStorage.setItem('Survey',true);
    }));