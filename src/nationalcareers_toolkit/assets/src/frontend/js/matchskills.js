    
    document.onreadystatechange = function() 
    {
        if (document.readyState == "complete") {
                                    
            //Back
            if ($('#BackLink').length > 0) {
                $('#BackLink').click(function(){history.back(); });
            }
            //Back end

            var allChecked=false;            
            //Selectall
            if ($('#selectSkillsGovukLinkSkillSelectToggle').length > 0) {                
                $('#selectSkillsGovukLinkSkillSelectToggle').click(function(e) {
                    allChecked = !allChecked;
                    e.preventDefault();
                    $("input:checkbox").prop('checked', allChecked);
                    var selectAll = 'Select all';
                    $(this).text($(this).text().includes(selectAll) ? 'Clear all' : selectAll);
                });
            }
            //Selectall end

            //Occupation search                        
            const searchForm = $('#occupationSearchFormGroupAutoComplete');                        
            if (searchForm.length > 0) {
                AutoComplete();
                const searchButton = $('#occupationSearchGovukSecondaryButtonSearch');
                const autoCompleteElement = $('#occupationSearchGovukAutoCompleteOccupationAutoComplete');            
                const summary = $('.govuk-error-summary');
                const autoCompleteError = $('#occupationSearchGovukAutoCompleteErrorSearchError');
                const display = {"display":""};
                
                searchButton.click(function(e) {
                    if (autoCompleteElement[0].value === '' || data.length <= 0  || $.inArray(autoCompleteElement[0].value, data) === -1) {
                        e.preventDefault();
                        summary.css(display);
                        autoCompleteError.css(display);
                        searchForm.addClass('govuk-form-group--error');
                    }
                });

            }
            //Occupation search end
        }
    };

//******************************    
//Occupation searh  functions
//******************************    
    function Suggest(query, populateResults) {
        runsearch(query, populateResults);
    }

    function runsearch(query, populateResults) {        
        $.ajax({
            type: 'GET',
            url: OccupationSearchAutoComplete.getAttribute("data-url"),
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

    function AutoComplete () {            
            accessibleAutocomplete({
                    element: document.querySelector('#occupations-autocomplete-container'),
                    id: 'occupationSearchGovukAutoCompleteOccupationAutoComplete', // To match it to the existing <label>.
                    source: Suggest,
                    autoselect: true,
                    confirmOnBlur: true,
                    cssNamespace: 'autocomplete',
                    defaultValue: '',
                    displayMenu: 'inline',
                    minLength: 2,
                    name: 'EnterJobInputAutocomplete',
                    onConfirm: function(){},
                    require: false,
                    showAllValues: false,
                    showNoOptionsFound: true
                }
            );
        }
    
//******************************    
//Occupation searh  functions end
//******************************    
