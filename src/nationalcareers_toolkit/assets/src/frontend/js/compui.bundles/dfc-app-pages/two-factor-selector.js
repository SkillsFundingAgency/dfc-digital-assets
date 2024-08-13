$(document).ready(function () {

    var levelOne = $('#triageLevelOne');
    var levelTwo = $('#triageLevelTwo');
    var levelTwoItems = [];
    hideTriageFromErrorMessage();
    $('#triage-tool-submit-button').on("click", function (e) {
        if (!$('#triageLevelOne').val()) {
            showTriageFromErrorMessage();
            e.preventDefault();
        } else {
            hideTriageFromErrorMessage();
        }
        
    });

    function showTriageFromErrorMessage() {
        $('#level-one-error-group').addClass('govuk-form-group--error');
        $('#triage-tool-validation-summary').removeClass('validation-summary-valid')
        $('#level-one-error').removeClass('hidden-triage-form-error');
        levelOne.addClass('govuk-select--error');

    }

    function hideTriageFromErrorMessage() {
        $('#triage-tool-validation-summary').addClass('validation-summary-valid')
        $('#level-one-error-group').removeClass('govuk-form-group--error');
        $('#level-one-error').addClass('hidden-triage-form-error');
        levelOne.removeClass('govuk-select--error');
    }

    levelOne.change(function () {
        var selectedLevelOne = $('#triageLevelOne').val();
        if (selectedLevelOne) {
            hideTriageFromErrorMessage();
            levelTwo.removeAttr('disabled');
            var apiCall = {
                url: '/api/triageleveltwo',
            };

            if (levelTwoItems.length) {
                var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
                levelTwo.html(optionHtml);
            } else {
                $.ajax({
                    type: "GET",
                    url: apiCall.url,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        if (data && data.triageLevelTwo) {
                            levelTwoItems = data.triageLevelTwo
                        }
                        var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
                        levelTwo.html(optionHtml);

                    },
                    failure: function () {
                        console.log('Failure, Retrieving Triage level two options');
                    },
                    error: function () {
                        console.log('Error, Retrieving Triage Tool two options');
                    }
                });
            }
        } else {
            showTriageFromErrorMessage();
            var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
            levelTwo.html(optionHtml);
            levelTwo.attr('disabled', 'disabled');

        }
    });

    function updateOptionList(levelTwoItems, selectedLevelOne) {
        var optionHtml = '';

        $.each(levelTwoItems,
            function (index, levelTwo) {
                if (levelTwo && levelTwo.levelOne && selectedLevelOne === levelTwo.levelOne.title) {

                    optionHtml = optionHtml + generateOptionHtml(levelTwo.title, levelTwo.title);
                }
            });
        return optionHtml;
    }
    function generateOptionHtml(value, item)
    {
            return '<option value="' + value + '">' + item + '</option>';
    }
       

      
    
});