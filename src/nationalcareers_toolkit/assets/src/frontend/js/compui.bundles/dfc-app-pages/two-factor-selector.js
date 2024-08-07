$(document).ready(function () {

    var levelOne = $('#triageLevelOne');
    var levelTwo = $('#triageLevelTwo');
    var levelTwoItems = [];

    levelOne.change(function () {
        var selectedLevelOne = $('#triageLevelOne').val();
        if (selectedLevelOne) {
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