
(function () {
    'use strict'; 

    //Script to set focus on accordion section links
    $('.in-progress li a').on('click', function (e) {
        $(e.target.hash).closest('.govuk-accordion__section').addClass('govuk-accordion__section--expanded');
    });

    //Set default state based on ehlstateCookie
    var ehlstateCookie = "ehlstateCookie";
    var ehlCookie = CookieBanner.getCookie(ehlstateCookie);
    if (ehlCookie === null) {

        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, true, 28);
        $("#ehl-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (ehlCookie === "true") {
        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, true, 28);
        $("#ehl-hide-link").text("Hide message");
        $('.ncs-toggle').show();
    }
    else if (ehlCookie === "false") {
        //Set cookie
        CookieBanner.setCookie(ehlstateCookie, false, 28);
        $("#ehl-hide-link").text("Show message");
        $('.ncs-toggle').hide();
    }

    //On click functionality
    $("#ehl-hide-link").click(function () {
        $(".ncs-toggle").slideToggle();
        if ($(this).text() === "Show message") {
            $(this).text("Hide message");

            // Update cookie status
            CookieBanner.setCookie(ehlstateCookie, true, 28);
        } else {
            $(this).text("Show message");
            // Update cookie status
            CookieBanner.setCookie(ehlstateCookie, false, 28);
        }
    });


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