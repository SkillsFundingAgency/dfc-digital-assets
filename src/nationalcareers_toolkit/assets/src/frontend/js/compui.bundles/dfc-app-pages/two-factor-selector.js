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
                var optionHtml = generateOptionHtml("select your situation", "select your situation");

                $.each(levelTwoItems,
                    function (index, levelTwo) {
                        if (selectedLevelOne === levelTwo.levelOneTitle) {

                            optionHtml = optionHtml + generateOptionHtml(levelTwo.title, levelTwo.title);
                        }
                    });
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
                        var optionHtml = generateOptionHtml("select your situation", "select your situation");
                        $.each(levelTwoItems,
                            function (index, levelTwo) {
                                if (selectedLevelOne === levelTwo.levelOneTitle) {
                                    optionHtml = optionHtml + generateOptionHtml(levelTwo.title, levelTwo.title);
                                }
                            });
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
            var optionHtml = generateOptionHtml("select your situation", "select your situation");

            $.each(levelTwoItems,
                function (index, levelTwo) {
                    if (selectedLevelOne === levelTwo.levelOneTitle) {

                        optionHtml = optionHtml + generateOptionHtml(levelTwo.title, levelTwo.title);
                    }
                });
            levelTwo.html(optionHtml);
            levelTwo.attr('disabled', 'disabled');

        }
    });
    
    

        
        function generateOptionHtml(value, item) {
            return '<option value="' + value + '">' + item + '</option>';
        }
       

      
    
});