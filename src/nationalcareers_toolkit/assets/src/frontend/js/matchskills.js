var allChecked=false;
$('#selectSkillsGovukLinkSkillSelectToggle').click(function(e) {
    allChecked = !allChecked;
    e.preventDefault();
    $("input:checkbox").prop('checked', allChecked);
    var selectAll = 'Select all';
    $(this).text($(this).text().includes(selectAll) ? 'Clear all' : selectAll);
});

/**************************** Occupation Search *****************************/
 <script>
    var dataFromSearch = [];
    document.onreadystatechange = function() {

        if (document.readyState == "complete") {
            AutoComplete();
            const autoCompleteElement = $('#occupationSearchGovukAutoCompleteOccupationAutoComplete');
            const searchButton = $('#occupationSearchGovukSecondaryButtonSearch');
            const summary = $('.govuk-error-summary');
            const autoCompleteError = $('#occupationSearchGovukAutoCompleteErrorSearchError');
            const display = {"display":""};
            const form = $('#occupationSearchFormGroupAutoComplete');
            searchButton.click(function(e) {


                if (autoCompleteElement[0].value === '' || data.length <= 0  || $.inArray(autoCompleteElement[0].value, data) === -1) {
                    e.preventDefault();
                    summary.css(display);
                    autoCompleteError.css(display);
                    form.addClass('govuk-form-group--error');
                }

            });
        }
    };

    function Suggest(query, populateResults) {
        runsearch(query, populateResults);
    }


    function runsearch(query, populateResults) {
        $.ajax({
            type: 'GET',
            url: 'https://dev.api.nationalcareersservice.org.uk/matchskills/OccupationSearchAuto',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: { occupation: query },
            success: function (data) {
                dataFromSearch = data;
                populateResults(data);
            },
            error: function(jqXHR, exception) {
                if (jqXHR.status === 0) {
                    console.log('**MatchSkills:Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    console.log('**MatchSkills:500 Error.');
                } else if (exception === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    alert('Time out error.');
                } else if (exception === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error.\n' + jqXHR.responseText);
                }
            }
        });
    }
    </script>    
/**************************************************************************************************************/