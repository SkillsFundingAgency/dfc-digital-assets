$('#CurrentSearchRequest_StartDateDobModel_SelectedDateFrom').removeAttr("data-val-date");

$(document).ready(function () {
    var validate = $('#courseRefinement').validate();
    if (validate) {
        validate.settings.ignore = [];
    }
  
    setToToday();
});

$("#CurrentSearchRequest_StartDateDobModel_Day").change(function () {
    PopulateSelectedDateFrom();
});

$("#CurrentSearchRequest_StartDateDobModel_Month").change(function () {
    PopulateSelectedDateFrom();
});

$("#CurrentSearchRequest_StartDateDobModel_Year").change(function () {
    PopulateSelectedDateFrom();
});


function PopulateSelectedDateFrom() {
    var sdfDay = $('#CurrentSearchRequest_StartDateDobModel_Day').val();
    var sdfMonth = $('#CurrentSearchRequest_StartDateDobModel_Month').val();
    var sdfDayYear = $('#CurrentSearchRequest_StartDateDobModel_Year').val();

    var selectedDateFrom = "";
    if (sdfDay || sdfMonth || sdfDayYear) {
        selectedDateFrom = sdfDayYear + '-' + sdfMonth + '-' + sdfDay;
    }

    $('#CurrentSearchRequest_StartDateDobModel_SelectedDateFrom').val(selectedDateFrom);
    $("#courseRefinement").length && $("#courseRefinement").validate().element('#CurrentSearchRequest_StartDateDobModel_SelectedDateFrom');
}


$("input[type='radio']").click(function () {
    var startDateValue = $("input[name='radio-date-group']:checked").val();
    if (startDateValue.toLowerCase() === "anytime" || startDateValue.toLowerCase() === "today") {
        setToToday();
    }
});

function setToToday() {
   
        var today = new Date();
        var sdfDay = today.getDate();
        var sdfMonth = today.getMonth() + 1;
        var sdfDayYear = today.getFullYear();

        $('#CurrentSearchRequest_StartDateDobModel_Day').val(sdfDay);
        $('#CurrentSearchRequest_StartDateDobModel_Month').val(sdfMonth);
        $('#CurrentSearchRequest_StartDateDobModel_Year').val(sdfDayYear);

        var selectedDateFrom = sdfDayYear + '-' + sdfMonth + '-' + sdfDay;

        $('#CurrentSearchRequest_StartDateDobModel_SelectedDateFrom').val(selectedDateFrom);

        $("#courseRefinement").length && $("#courseRefinement").validate().element('#CurrentSearchRequest_StartDateDobModel_Day');
        $("#courseRefinement").length && $("#courseRefinement").validate().element('#CurrentSearchRequest_StartDateDobModel_Month');
        $("#courseRefinement").length && $("#courseRefinement").validate().element('#CurrentSearchRequest_StartDateDobModel_Year');
        $("#courseRefinement").length && $("#courseRefinement").validate().element('#CurrentSearchRequest_StartDateDobModel_SelectedDateFrom');
    
}