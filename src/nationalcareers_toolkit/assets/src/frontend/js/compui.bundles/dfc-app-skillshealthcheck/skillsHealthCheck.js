$(document).ready(function () {
    $("#skillsForm").submit(function (event) {
        var validator = $("#skillsForm").validate();
        if (!validator.checkForm()) {
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
                        AddErrorOnField("#answerSelectionError", "When No error is selected no other answer can be chosen", event);
                    }
                });

            }
        } else {
            AddErrorOnField("#answerSelectionError", "Choose an answer", event);
        }
    });


    $("#skillsListForm").submit(function (event) {

        var skillsAssessmentComplete = $("#skillsAssessmentComplete").val();

        if (skillsAssessmentComplete === "True") {

            var selectedJobs = $("input[name='JobFamilyList.SelectedJobs']:checked");

            if (selectedJobs && selectedJobs.length > 3) {
                $("#selectedJobError").text("Please select a maximum of 3 jobs");
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

    watchVisibility('.session-timeout');
});

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

function watchVisibility(elementName) {
    const element = document.querySelector(elementName);

    // Function to handle visibility change
    const handleVisibilityChange = () => {
        if (element.style.visibility === 'visible') {
            createFocusTrap(element);
        }
    };

    // Observer for visibility changes
    const observer = new MutationObserver(handleVisibilityChange);

    // Observe changes in style attribute of element
    observer.observe(element, { attributes: true, attributeFilter: ['style'] });
};

function createFocusTrap(element) {
    // If element does not exist or is not visible, exit
    if (!element || getComputedStyle(element).visibility !== 'visible') {
        return;
    }

    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' || e.keyCode === 9) {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    });
}