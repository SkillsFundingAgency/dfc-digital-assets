$(document).ready(function () {
    $(".find-a-course-page:first").each(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var distance = urlParams.get('D');
        var searchTerm = urlParams.get('searchTerm');
        var town = urlParams.get('town');
        var coordinates = urlParams.get('coordinates');
        var didYouMeanLocationParam = urlParams.get('location');
        if (searchTerm == null) {
            searchTerm = urlParams.get('SearchTerm');
        }
        if (town == null) {
            town = urlParams.get('townOrPostcode');
        }
        if (coordinates == null) {
            coordinates = urlParams.get('sideBarCoordinates');
        }
        if (didYouMeanLocationParam != null && town == null) {
            [town, ...coordinates] = didYouMeanLocationParam.split("|");
            coordinates = coordinates.join('|')
        }
        
        showHideDistanceInput(distance != null && distance === "1", null);
        generateClearLink(distance != null && distance === "1" ? 1 : 0);
        showHideClearFilters(anyFiltersSelected(getParams()), searchTerm, town, coordinates);
    });

    $('#search-button').on('click', function (e) {
        searchFAC(getParams());
    });

    //Small timeout to ensure we don't poll on every single pixel change
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(redrawAutocompleteDropdown, 100);
    });


    $(window).on('popstate', function (e) {
        var loc = $(location).attr("href");
        if (loc.split('/').pop().toLowerCase() === "find-a-course" ||
            loc.split('/').pop().toLowerCase() === "searchfreecourse" ||
            loc.split('?')[0].split('/').pop().toLowerCase() === "page" ||
            loc.split('?')[0].split('/').pop().toLowerCase() === "search"
        ) {
            location.reload(true);
            e.preventDefault();
        }
    });

    $('.find-a-course-page #distance-select, .find-a-course-page #startdate-select').on('change', function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #orderBy-Input').on('change', function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #courseType input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });    

    $(document).on("click", ".find-a-course-page #sectors input[type=checkbox]", function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });    

    $('.find-a-course-page #learningMethod input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });

    $('#courseHours input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });
    $('.find-a-course-page #courseStudyTime input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #qualificationLevels input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams(true));
        e.preventDefault();
        return false;
    });

    $("#fac-search-course-form").submit(function (e) {
        return false;
    });

    $("#applyfilters-button").hide();
});

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function clearFilters(paramValues) {
    paramValues.CourseType = '';
    paramValues.Sectors = '';
    paramValues.LearningMethod = '';
    paramValues.CourseHours = '';
    paramValues.CourseStudyTime = '';
    paramValues.QualificationLevels = '';

    $('.find-a-course-page #courseType input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    $('.find-a-course-page #sectors input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    $('.find-a-course-page #learningMethod input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    $('.find-a-course-page #courseHours input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    $('.find-a-course-page #courseStudyTime input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    $('.find-a-course-page #qualificationLevels input[type=checkbox]').each(function () {
        $(this).prop('checked', false)
    });

    return paramValues;
}

function CheckLocationAndSearchIfValid(e) {
    if (isEnteringPostCode) {
        makeAjaxCall(getParams());
    }
    e.preventDefault();
    return false;
}

function generateClearLink(d) {
    $('#fac-result-list a').each(function (index, element) {
        if (element.getAttribute('href')) {
            var contactus = element.getAttribute('href').indexOf('contact-us') === -1;
            var isExternalLink = element.getAttribute('href').indexOf('http') === 0;
            if (!isExternalLink && contactus) {
                element.href = element.href.replace('&D=0', '').replace('&D=1', '') + '&D=' + d;
            }
        }
    });
}

function showHideDistanceInput(show, orderBy) {
    if (show === true) {
        $('.find-a-course-page #distance-block').show();
        if ($("#orderBy-Input").length && $(".find-a-course-page #orderBy-Input option[value='Distance']").length < 1) {
            $("#orderBy-Input")[0].options.add(new Option("Distance", "Distance"));
        }
    }
    else {
        $('.find-a-course-page #distance-block').hide();
        $(".find-a-course-page #orderBy-Input option[value='Distance']").remove();
    }
}

function showHideClearFilters(show, searchTerm, town, coordinates) {
    if (show === true) {
        var D = 0;
        if (typeof town !== 'undefined' && town) {
            D = 1;
        }

        if (typeof ($('#facFreeCourseSearch:input')[0]) != "undefined" && $('#facFreeCourseSearch:input')[0].value === 'True') {
            $(".fac-filters-block").html("<p id='fac-clear-filters'><a id='clear-filters' href='/find-a-course/searchFreeCourse?searchTerm=" + searchTerm + "&townOrPostcode=" + town + "&sideBarCoordinates=" + coordinates +"&sideBarSuggestedLocation="+ town +"&D="+ D +"' aria-label='ClearFilters'>Clear filters</a></div>");
        }
        else {
            $(".fac-filters-block").html("<p id='fac-clear-filters'><a id='clear-filters' href='/find-a-course/searchcourse?searchTerm=" + searchTerm + "&townOrPostcode=" + town + "&sideBarCoordinates=" + coordinates + "&sideBarSuggestedLocation=" + town + "&D=" + D +"' aria-label='ClearFilters'>Clear filters</a></div>");
        }
        $(".fac-filters-block").show();
    }
    else {
        $(".fac-filters-block").hide();
    }
}

function anyFiltersSelected(paramValues) {
    if (paramValues.Town != '' ||
        paramValues.StartDate != 'Anytime' ||
        paramValues.CourseType.length > 1 ||
        paramValues.Sectors.length > 1 ||
        paramValues.LearningMethod.length > 1 ||
        paramValues.CourseHours.length > 1 ||
        paramValues.CourseStudyTime.length > 1 ||
        paramValues.QualificationLevels.length > 0) {
        return true;
    }

    return false;
}

function makeAjaxCall(paramValues) {
    console.info("making ajax request");
    var stringifield = JSON.stringify(paramValues, paramReplacer);
    var apiCall = {
        url: '/api/Ajax/Action',
        path: 'find-a-course',
        method: 'Ajax'
    };

    $.ajax({
        type: "GET",
        url: apiCall.url,
        contentType: "application/json",
        dataType: "json",
        data: { path: apiCall.path, method: apiCall.method, appData: stringifield },
        success: function (data) {
            var replacementMarkup = data.offlineHtml;
            var resultCount = "no ";
            var showDistanceSelector = false;
            var sectorsFilterHtml = "";
            if (data.isHealthy === true && data.payload != null) {
                var parsedData = JSON.parse(data.payload);
                replacementMarkup = parsedData.html;
                sectorsFilterHtml = parsedData.sectorsSideBarHTML
                resultCount = parsedData.count;
                showDistanceSelector = parsedData.isPostcode || parsedData.showDistanceSelector;
                /* Once this code and the FAC app with location is fully deployed the  parsedData.isPostcode can be removed */
            }
            $('#fac-result-list').html("");
            $('#fac-result-list').html(replacementMarkup);
            $('.fac-result-count').html("");
            $('.fac-result-count').html(addCommas(resultCount));
            (resultCount > 0) ? $('.no-count-block').show() : $('.no-count-block').hide();

            $('#sectors-block').html("");
            $('#sectors-block').html(sectorsFilterHtml);

            showHideClearFilters(anyFiltersSelected(paramValues), paramValues.SearchTerm, paramValues.Town, paramValues.Coordinates);
            paramValues.D = showDistanceSelector === true ? 1 : 0;
            showHideDistanceInput(showDistanceSelector, paramValues.OrderByValue);
            generateClearLink(paramValues.D);
            updateLocationSuggestions(parsedData);
            $('#orderBy-Input option').removeAttr('selected').filter(`[value='${paramValues.OrderByValue}']`).attr('selected', true);
            var updatedUrl = getUpdatedUrl(paramValues);
            window.history.pushState({ path: updatedUrl }, '', updatedUrl);
        },
        failure: function () {
            console.log('Failure, in ajax call');
        },
        error: function () {
            console.log('Error, calling ajax call');
        }
    });
}

function searchFAC(paramValues) {
    var showDistanceSelector = false;
    showDistanceSelector = (paramValues.Town != '');
    paramValues.D = showDistanceSelector === true ? 1 : 0;
    var updatedUrl = getUpdatedUrl(paramValues);
    window.location.href = updatedUrl;
}

function paramReplacer(key, value) {
    if (key === 'Town') {
        return value.substring(0, 25);
    }
    return value;
}

function getUpdatedUrl(paramValues) {
    var query = "searchTerm=" + paramValues.SearchTerm + "&" +
        "distance=" + paramValues.Distance + "&" +
        "town=" + paramValues.Town + "&" +
        "orderByValue=" + paramValues.OrderByValue + "&" +
        "startDate=" + paramValues.StartDate + "&" +
        "courseType=" + paramValues.CourseType + "&" +
        "sectors=" + paramValues.Sectors + "&" +
        "learningMethod=" + paramValues.LearningMethod + "&" +
        "courseHours=" + paramValues.CourseHours + "&" +
        "courseStudyTime=" + paramValues.CourseStudyTime + "&" +
        "filterA=" + paramValues.FilterA + "&" +
        "page=" + paramValues.Page + "&" +
        "D=" + paramValues.D + "&" +
        "coordinates=" + paramValues.Coordinates + "&" +
        "campaignCode=" + paramValues.CampaignCode + "&" +
        "qualificationLevels=" + paramValues.QualificationLevels;

    return "/find-a-course/page?" + query;
}

function getParams(sortByLocation = false) {
    $('.find-a-course-page #RequestPage').val(1);

    var searchTerm = $('.find-a-course-page #search-input').val();
    var distance = $('.find-a-course-page #distance-select').val();
    var town = $('.find-a-course-page #location-input').val();
    var orderByValue = $('.find-a-course-page #orderBy-Input').val();
    if (!sortByLocation) {
        if (town) {
            orderByValue = "Distance";
        }
        else {
            orderByValue = "Relevance";
        }
    }
    var page = $('.find-a-course-page #RequestPage').val();
    var startDate = $('.find-a-course-page #startdate-select').val();
    var courseType = [];
    var sectors = [];
    var learningMethod = [];
    var courseHours = [];
    var courseStudyTime = [];
    var qualificationLevels = [];
    var coordinates = $('.find-a-course-page #coordinates').val();

    $('.find-a-course-page #courseType input[type=checkbox]:checked').each(function () {
        courseType.push(this.value);
    });

    $('.find-a-course-page #sectors input[type=checkbox]:checked').each(function () {
        sectors.push(this.value);
    });

    $('.find-a-course-page #learningMethod input[type=checkbox]:checked').each(function () {
        learningMethod.push(this.value);
    });
    $('.find-a-course-page #courseHours input[type=checkbox]:checked').each(function () {
        courseHours.push(this.value);
    });
    $('.find-a-course-page #courseStudyTime input[type=checkbox]:checked').each(function () {
        courseStudyTime.push(this.value);
    });
    $('.find-a-course-page #qualificationLevels input[type=checkbox]:checked').each(function () {
        qualificationLevels.push(this.value);
    });
    var campaignCode = $("#facCampaignCode").val();

    //Strip the special characters
    var trimmedSearchTerm = searchTerm.replace(/[^A-Z0-9 ]+/ig, "");
    var paramValues = {
        SearchTerm: trimmedSearchTerm,
        Distance: (distance == null) ? '10 miles' : distance,
        Town: town,
        OrderByValue: (orderByValue == null) ? 'Relevance' : orderByValue,
        StartDate: (startDate == null) ? 'Anytime' : startDate,
        CourseType: courseType.toString(),
        Sectors: sectors.toString(),
        LearningMethod: learningMethod.toString(),
        CourseHours: courseHours.toString(),
        CourseStudyTime: courseStudyTime.toString(),
        FilterA: true,
        Page: Number.isNaN(parseInt(page)) ? 1 : parseInt(page),
        D: 0,
        Coordinates: coordinates,
        CampaignCode: (campaignCode == null) ? '' : campaignCode,
        QualificationLevels: qualificationLevels.toString()
    };
    return paramValues;
}

//Location suggest code
if (window.location.href.indexOf("find-a-course") > -1) {
    $(document).ready(function () {
        $("#location-input").on("input", function () {
            resetLocationDataUnderAutocompleteMinLength();
        });
        $("#location-input").autocomplete({
            source: function (request, response) { 
                //Get Location Auto-Complete suggestions
                getLocations(request, response)
            },
            minLength: 2,
            position: {
                my: "left top",
                at: "left bottom"
            },
            select: function (event, ui) {
                if (inLocationMode) {
                    $('#coordinates').val(ui.item.value); // save selected id to hidden input
                    $('#location-input').val(ui.item.label).blur(); // display the selected text and force refresh
                    return false;
                }
                return true;
            },
            focus: function (event, ui) {
                event.preventDefault(); // or return false;
            },
            open: function (event, ui) {
                $("ul.ui-menu").width($(this).innerWidth());
                $('ul.ui-autocomplete').scrollTop(0);
            }
        });
    });
}

function isEnteringPostCode(term) {
    var regex = /\d/g;
    return regex.test(term);
}
 
function resetLocationDataUnderAutocompleteMinLength() {
    var locationInputLength = $("#location-input").val().length;
    if (locationInputLength < 2) {
        locationData = undefined;
        inLocationMode = false;
    }
}

function redrawAutocompleteDropdown() {
    $("#location-input").autocomplete("search");
}

var resizeTimer;
var locationData;
var inLocationMode = false;
function getLocations(request, response) {

    var apiCall = {
        url: '/api/Ajax/Action',
        path: 'find-a-course',
        method: 'Ajax-Location'
    };

    $.ajax({
        type: "GET",
        url: apiCall.url,
        contentType: "application/json",
        dataType: "json",
        data: { path: apiCall.path, method: apiCall.method, appData: request.term },
        success: function (data) {
            if (data.isHealthy === true && data.payload != null) {
                locationData = JSON.parse(data.payload)
                response(locationData)
                inLocationMode = true;
            }
        },
        failure: function () {
            console.log('Failured to get locations');
        },
        error: function () {
            console.log('Error getting locations');
        }
    });
}

function updateLocationSuggestions(dataModel) {
    if (dataModel.usingAutoSuggestedLocation) {
        $('.find-a-course-page #location-input').val(dataModel.autoSuggestedTown)
        $('.find-a-course-page #coordinates').val(dataModel.autoSuggestedCoordinates)
        if (dataModel.didYouMeanLocations.length > 0) {
            var didYouMeanList = $('.find-a-course-page #suggested-locations')
            didYouMeanList.empty();
            for (ii = 0; ii < dataModel.didYouMeanLocations.length; ii++) {
                $("<li data-coordinates='" + dataModel.didYouMeanLocations[ii].value + "' ><a href='#'>" + dataModel.didYouMeanLocations[ii].label + "</a></li>").appendTo(didYouMeanList);
            }
            $('.find-a-course-page #suggested-locations-text').animate({ scrollTop: (0) });
        }
    }
}

$('.find-a-course-page #suggested-locations').on("click", 'li', function (event) {
    $('#coordinates').val($(this).attr("data-coordinates")); // save selected id to hidden input
});
