
(function () {
    'use strict'; 
    $("#skillsForm").submit(function (event) {
        var validator = $("#skillsForm").validate();
        if (!validator.valid()) {
            $(".field-validation-error").closest(".form-group").addClass("error");
            event.preventDefault();
        } 
    });

    $("#skillsCheckingForm").submit(function (event) {
        RemoveErrorOnField("#answerSelectionError");
        var answerSelectionList = $("input[name='AnswerSelection']:checked");
        if (answerSelectionList && answerSelectionList.length > 0) {
          
            if (answerSelectionList.length > 1) {
                $.each(answerSelectionList, function (i, val) {
                    if ("E" === val.value) {
                        AddErrorOnField("#answerSelectionError", shcClientValMsgs.cannotSelectBothTypes, event);
                    }
                });
          
            }
        } else {
            AddErrorOnField("#answerSelectionError", shcClientValMsgs.chooseAnswer, event);
        }
    });
    

    $("#skillsListForm").submit(function (event) {
      
        var skillsAssessmentComplete = $("#skillsAssessmentComplete").val();

        if (skillsAssessmentComplete === "True") {
                
            var selectedJobs = $("input[name='JobFamilyList.SelectedJobs']:checked");

            if(selectedJobs && selectedJobs.length > 3)
            {
                $("#selectedJobError").text(shcClientValMsgs.maxJobSel);
                $("#selectedJobError").addClass("field-validation-error").removeClass("field-validation-valid");
                $(".field-validation-error").closest(".form-group").addClass("error");
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: $("#selectedJobError").offset().top - 300
                }, 5000);
            } else {
                $("#selectedJobError").text("");
                $(".field-validation-error").closest(".form-group").removeClass("error");
                $("#selectedJobError").removeClass("field-validation-error").addClass("field-validation-valid");
            }
        }
        
    });
})();


function RemoveErrorOnField(id) {
    $(id).text("");
    $(id).removeClass("field-validation-error");
    $(".field-validation-error").closest(".form-group").removeClass("error");

}

function AddErrorOnField(id, errorText, event) {
    $(id).text(errorText);
    $(id).addClass("field-validation-error").removeClass("field-validation-valid");
    $(".field-validation-error").closest(".form-group").addClass("error");
    event.preventDefault();
}