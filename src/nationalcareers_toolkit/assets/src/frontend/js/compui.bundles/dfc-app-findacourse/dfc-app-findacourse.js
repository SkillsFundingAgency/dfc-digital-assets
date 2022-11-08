$(document).ready(function () {
    $(".find-a-course-page:first").each(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var distance = urlParams.get('D');
        var searchTerm = urlParams.get('searchTerm');
        if (searchTerm == null) {
            searchTerm = urlParams.get('SearchTerm');
        }
        var town = urlParams.get('town');
        var campaignCode = urlParams.get("campaignCode");
        var view = urlParams.get("view");

        showHideSearchResult(searchTerm, town, campaignCode, view)
        showHideDistanceInput(distance != null && distance === "1", null);
        generateClearLink(distance != null && distance === "1" ? 1 : 0);
        showHideClearFilters(anyFiltersSelected(getParams()), searchTerm);
    });

    $(window).on('popstate', function (e) {
        if ($(location).attr("href").split('/').pop().toLowerCase() === "find-a-course") {
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

    $('.find-a-course-page #search-button').on('click', function (e) {
        makeAjaxCall(getParams());
    });

    $('.find-a-course-page #courseType input[type=checkbox]').change(function (e) {
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

    $("#fac-search-course-form, #fac-filter-form").submit(function (e) {
        return false;
    });

    $("#applyfilters-button").hide();

    $('.find-a-course-page').on('click', 'a#clear-filters', function (e) {
        var paramValues = clearFilters(getParams());
        makeAjaxCall(paramValues);
        e.preventDefault();
        return false;
    });
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
    paramValues.CourseHours = '';
    paramValues.CourseStudyTime = '';
    paramValues.QualificationLevels = '';

    $('.find-a-course-page #courseType input[type=checkbox]').each(function () {
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
            var isExternalLink = element.getAttribute('href').indexOf('http') === 0;
            if (!isExternalLink) {
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

function showHideClearFilters(show, searchTerm) {
    if (show === true) {
        if (typeof ($('#facFreeCourseSearch:input')[0]) != "undefined" && $('#facFreeCourseSearch:input')[0].value === 'True') {
            $(".fac-filters-block").html("<p id='fac-clear-filters'><a id='clear-filters' href='/find-a-course/searchFreeCourse?searchTerm=" + searchTerm + "' aria-label='ClearFilters'>Clear filters</a></p>");
        }
        else {
            $(".fac-filters-block").html("<p id='fac-clear-filters'><a id='clear-filters' href='/find-a-course/searchcourse?searchTerm=" + searchTerm + "' aria-label='ClearFilters'>Clear filters</a></p>");
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
        paramValues.CourseHours.length > 1 ||
        paramValues.CourseStudyTime.length > 1 ||
        paramValues.QualificationLevels.length > 0) {
        return true;
    }

    return false;
}

function showHideSearchResult(searchTerm, town, campaignCode, view) {
    if (!view && (searchTerm || town) ||
        (!searchTerm && !town && campaignCode)) {
        $('.find-a-course-page #search-result-block').show();
        $('.find-a-course-page #home-block').hide();
    }
    else {
        $('.find-a-course-page #search-result-block').hide();
        $('.find-a-course-page #home-block').show();
    }
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
            if (data.isHealthy === true && data.payload != null) {
                var parsedData = JSON.parse(data.payload);
                replacementMarkup = parsedData.html;
                resultCount = parsedData.count;
                showDistanceSelector = parsedData.isPostcode || parsedData.showDistanceSelector;
                /* Once this code and the FAC app with location is fully deployed the  parsedData.isPostcode can be removed */
            }
            $('#fac-result-list').html("");
            $('#fac-result-list').html(replacementMarkup);
            $('.fac-result-count').html("");
            $('.fac-result-count').html(addCommas(resultCount));
            (resultCount > 0) ? $('.no-count-block').show() : $('.no-count-block').hide();
            
            showHideClearFilters(anyFiltersSelected(paramValues), paramValues.SearchTerm);
            paramValues.D = showDistanceSelector === true ? 1 : 0;
            showHideDistanceInput(showDistanceSelector, paramValues.OrderByValue);
            generateClearLink(paramValues.D);
            updateLocationSuggestions(parsedData);
            $('#orderBy-Input option').removeAttr('selected').filter(`[value='${paramValues.OrderByValue}']`).attr('selected', true);
            var updatedUrl = getUpdatedUrl(paramValues);
            window.history.pushState({ path: updatedUrl }, '', updatedUrl);
            window.location.reload();
        },
        failure: function () {
            console.log('Failure, in ajax call');
        },
        error: function () {
            console.log('Error, calling ajax call');
        }
    });
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

function getParams(sortByLocation=false) {
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
    var courseHours = [];
    var courseStudyTime = [];
    var qualificationLevels = [];
    var coordinates = $('.find-a-course-page #coordinates').val();
    $('.find-a-course-page #courseType input[type=checkbox]:checked').each(function () {
        courseType.push(this.value);
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
        Distance: (typeof distance == 'undefined' && distance) ? '' : distance,
        Town: town,
        OrderByValue: (typeof orderByValue == 'undefined' && orderByValue) ? '' : orderByValue,
        StartDate: (typeof startDate == 'undefined' && startDate) ? '' : startDate,
        CourseType: courseType.toString(),
        CourseHours: courseHours.toString(),
        CourseStudyTime: courseStudyTime.toString(),
        FilterA: true,
        Page: Number.isNaN(parseInt(page)) ? 1 : parseInt(page),
        D: 0,
        Coordinates: coordinates,
        CampaignCode: (typeof campaignCode == 'undefined' && campaignCode) ? '' : campaignCode,
        QualificationLevels: qualificationLevels.toString()
    };
    return paramValues;
}

//Location suggest code
if (window.location.href.indexOf("find-a-course") > -1) {
    $(document).ready(function () {
        $("#location-input").autocomplete({
            source: function (request, response) {
                $('#coordinates').val('')
                //Do not make call to location search, if this may be a postcode
                if (!isEnteringPostCode(request.term)) {
                    getLocations(request, response)
                }
                else {
                    inLocationMode = false;
                }
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
                $('ul.ui-autocomplete').scrollTop(0);
            }
        });
    });
}

function isEnteringPostCode(term) {
    var regex = /\d/g;
    return regex.test(term);
}

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
    $('#location-input').val($(this).text()).blur(); // display the selected text and force refresh
});
