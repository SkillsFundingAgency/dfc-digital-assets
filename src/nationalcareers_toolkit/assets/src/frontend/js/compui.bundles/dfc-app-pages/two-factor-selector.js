$(document).ready(function () {
    var levelOne = $('#triageLevelOne');
    var levelTwo = $('#triageLevelTwo');
    var levelOneItems = [];
    var levelTwoItems = [];
    hideTriageFormErrorMessage();
    $('#triage-tool-submit-button').on("click", function (e) {
        if (!$('#triageLevelOne').val()) {
            showTriageFormErrorMessage();
            e.preventDefault();
        } else {
            hideTriageFormErrorMessage();
        }
    });
    function showTriageFormErrorMessage() {
        $('#level-one-error-group').addClass('govuk-form-group--error');
        $('#triage-tool-validation-summary').removeClass('validation-summary-valid')
        $('#level-one-error').removeClass('hidden-triage-form-error');
        levelOne.addClass('govuk-select--error');
    }
    function hideTriageFormErrorMessage() {
        $('#triage-tool-validation-summary').addClass('validation-summary-valid')
        $('#level-one-error-group').removeClass('govuk-form-group--error');
        $('#level-one-error').addClass('hidden-triage-form-error');
        levelOne.removeClass('govuk-select--error');
    }
    levelOne.change(function () {
        var selectedLevelOne = $('#triageLevelOne').val();
        if (selectedLevelOne) {
            hideTriageFormErrorMessage();
            levelTwo.removeAttr('disabled');
            var apiCall = {
                url: '/api/Ajax/Action',
                path: 'pages',
                method: 'Ajax'
            };

            if (levelOneItems.length) {
                var l1 = levelOneItems.find(x => x.value === selectedLevelOne)
                if (l1 && l1.levelTwo) {
                    levelTwoItems = l1.levelTwo.contentItems;
                }
                var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
                levelTwo.html(optionHtml);
            } else {
                $.ajax({
                    type: "GET",
                    url: apiCall.url,
                    contentType: "application/json",
                    dataType: "json",
                    data: { path: apiCall.path, method: apiCall.method },
                    success: function (data) {
                        if (data.isHealthy === true && data.payload != null) {
                            options = JSON.parse(data.payload);
                            if (options && options.triageLevelOne) {
                                levelOneItems = options.triageLevelOne;
                                if (levelOneItems) {
                                    var l1 = levelOneItems.find(x => x.value === selectedLevelOne)
                                    if (l1 && l1.levelTwo) {
                                        levelTwoItems = l1.levelTwo.contentItems;
                                    }
                                }
                            }
                            var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
                            levelTwo.html(optionHtml);
                        }
                        
                    },
                    failure: function () {
                        console.log('Failure, Retrieving Triage level two options');
                    },
                    error: function () {
                        console.log('Error, Retrieving Triage level two options');
                    }
                });
            }
        } else {
            showTriageFormErrorMessage();
            var optionHtml = updateOptionList(levelTwoItems, selectedLevelOne);
            levelTwo.html(optionHtml);
            levelTwo.attr('disabled', 'disabled');
        }
    });
    function updateOptionList(levelTwoItems, selectedLevelOne) {
        var optionHtml = '';
        $.each(levelTwoItems,
            function (index, levelTwo) {
                    optionHtml += generateOptionHtml(levelTwo.title, levelTwo.title);
            });
        return optionHtml;
    }
    function generateOptionHtml(value, item)
    {
        return '<option value="' + value + '">' + item + '</option>';
    }
});