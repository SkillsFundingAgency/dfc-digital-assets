$('#DateOfBirth').removeAttr("data-val-date");

$(document).ready(function () {
    var validate = $('#ContactAdvisorForm').validate();
    if (validate) {
        validate.settings.ignore = [];
    }
});

$("#DateOfBirthDay").change(function () {
    PopulateDateOfBirth();
});

$("#DateOfBirthMonth").change(function () {
    PopulateDateOfBirth();
});

$("#DateOfBirthYear").change(function () {
    PopulateDateOfBirth();
});

function PopulateDateOfBirth() {
    var dobDay = $('#DateOfBirthDay').val();
    var dobMonth = $('#DateOfBirthMonth').val();
    var dobDayYear = $('#DateOfBirthYear').val();

    if (dobDay !== "" && dobMonth !== "" && dobDayYear !== "") {
        var dateOfBirth = "";
        if (dobDay || dobMonth || dobDayYear) {
            dateOfBirth = dobDay + '/' + dobMonth + '/' + dobDayYear;
        }

        $('#DateOfBirth').val(dateOfBirth);
        $("#ContactAdvisorForm").validate().element('#DateOfBirth');
    }
}
