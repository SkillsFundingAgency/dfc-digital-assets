$('#Identity_PersonalDetails_DateOfBirth').removeAttr("data-val-date");

$(document).ready(function () {
    var validate = $('#EditDetailsForm').validate();
    if (validate) {
        validate.settings.ignore = [];
    }

    PopulateDateOfBirthDetails();
});

$("#Identity_PersonalDetails_DateOfBirthDay").change(function () {
    PopulateDateOfBirthDetails();
});

$("#Identity_PersonalDetails_DateOfBirthMonth").change(function () {
    PopulateDateOfBirthDetails();
});

$("#Identity_PersonalDetails_DateOfBirthYear").change(function () {
    PopulateDateOfBirthDetails();
});


function PopulateDateOfBirthDetails() {
    var dobDay = $('#Identity_PersonalDetails_DateOfBirthDay').val();
    var dobMonth = $('#Identity_PersonalDetails_DateOfBirthMonth').val();
    var dobDayYear = $('#Identity_PersonalDetails_DateOfBirthYear').val();

    if (dobDay !== "" && dobMonth !== "" && dobDayYear !== "") {
        var dateOfBirth = "";
        if (dobDay || dobMonth || dobDayYear) {
            dateOfBirth = dobDay + '/' + dobMonth + '/' + dobDayYear;
        }

        $('#Identity_PersonalDetails_DateOfBirth').val(dateOfBirth);
        $("#EditDetailsForm").length && $("#EditDetailsForm").validate().element('#Identity_PersonalDetails_DateOfBirth');
    }
}


$("#EditDetailsSubmit").click(function (e) {

    $('#EditDetailsForm .error-summary ul').empty();

    var validator = $('#EditDetailsForm').validate();
    if ($('#EditDetailsForm').valid()) {
        $("#EditDetailsForm").submit(e);
    }
    else {
        $('#ValidationSummaryBox').show();

        for (var i = 0; i < validator.errorList.length; i++) {
            var linkElement = validator.errorList[i].element.name.split('.').join('_');
            $('#EditDetailsForm .error-summary ul').append('<li><a href="#' + linkElement + '">' + validator.errorList[i].message + '</a></li>');
        }

        $('html,body').animate({
            scrollTop: $("#ValidationSummaryBox").offset().top
        }, 2000);

        return false;
    }
});


