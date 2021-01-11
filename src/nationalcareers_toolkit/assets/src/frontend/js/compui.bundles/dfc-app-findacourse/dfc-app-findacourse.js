
$(document).ready(function () {
    $('.find-a-course-page #distance-block').hide();
    $(".find-a-course-page #orderBy-Input option[value='Distance']").remove();
    $(".fac-filters-block").hide();
    const urlParams = new URLSearchParams(window.location.search);
    const distance = urlParams.get('d');
    if (distance === 1) {
        $('.find-a-course-page #distance-block').show();
        $("#orderBy-Input")[0].options.add(new Option("Distance", "Distance"));
    }

    $('.find-a-course-page #orderBy-Input, .find-a-course-page #distance-select, .find-a-course-page #startdate-select').on('change', function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #search-input').keypress(function (e) {
        if (e.which === 13) {
            $('.find-a-course-page #RequestPage').val(1);
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('.find-a-course-page #search-input').on("blur", function (e) {
        $('.find-a-course-page #RequestPage').val(1);
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #location-input').keypress(function (e) {
        if (e.which === 13) {
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('.find-a-course-page #location-input').on("blur", function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('.find-a-course-page #courseType input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('#courseHours input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('.find-a-course-page #courseStudyTime input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $("#fac-search-course-form, #fac-filter-form").submit(function (e) {
        return false;
    });

    $("#applyfilters-button").hide();

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

    function generateClearLink() {
        $('#fac-result-list a').each(function () {
            this.href += '&d=1';
        });
    }

    function makeAjaxCall(paramValues) {
        var stringifield = JSON.stringify(paramValues);
        var updatedUrl = getUpdatedUrl(paramValues);
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
                var isPostcode = false;
                if (data.isHealthy === true && data.payload != null) {
                    var parsedData = JSON.parse(data.payload);
                    replacementMarkup = parsedData.html;
                    resultCount = parsedData.count;
                    isPostcode = parsedData.isPostcode;
                }
                $('#fac-result-list').html("");
                $('#fac-result-list').html(replacementMarkup);
                $('.fac-result-count').html("");
                $('.fac-result-count').html(addCommas(resultCount));
                $("#fac-clear-filters").show();
                $(".fac-filters-block").show();
                var searchTerm = $('.find-a-course-page #search-input').val();
                $(".fac-filters-block").html("<p id='fac-clear-filters'><a href='/find-a-course/searchcourse?searchTerm=" + searchTerm + "' aria-label='ClearFilters'>Clear filters</a></p>");
                if (isPostcode === true) {
                    $('.find-a-course-page #distance-block').show();
                    if ($(".find-a-course-page #orderBy-Input option[value='Distance']").length < 1) {
                        $("#orderBy-Input")[0].options.add(new Option("Distance", "Distance"));
                    }
                    generateClearLink();
                }
                else {
                    $('.find-a-course-page #distance-block').hide();
                    $(".find-a-course-page #orderBy-Input option[value='Distance']").remove();
                }

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

    function getUpdatedUrl(paramValues) {
        var query = "searchTerm=" + paramValues.SearchTerm + "&" +
            "distance=" + paramValues.Distance + "&" +
            "town=" + paramValues.Town + "&" +
            "orderByValue=" + paramValues.OrderByValue + "&" +
            "startDate=" + paramValues.StartDate + "&" +
            "courseType=" + paramValues.CourseType + "&" +
            "courseHours=" + paramValues.CourseHours + "&" +
            "studyTime=" + paramValues.CourseStudyTime + "&" +
            "filterA=" + paramValues.FilterA + "&" +
            "page=" + paramValues.Page;

        return "/find-a-course/page?" + query;
    }

    function getParams() {
        var orderByValue = $('.find-a-course-page #orderBy-Input').val();
        var searchTerm = $('.find-a-course-page #search-input').val();
        var distance = $('.find-a-course-page #distance-select').val();
        var town = $('.find-a-course-page #location-input').val();
        var page = $('.find-a-course-page #RequestPage').val();
        var startDate = $('.find-a-course-page #startdate-select').val();
        var courseType = [];
        var courseHours = [];
        var courseStudyTime = [];
        $('.find-a-course-page #courseType input[type=checkbox]:checked').each(function () {
            courseType.push(this.value);
        });
        $('.find-a-course-page #courseHours input[type=checkbox]:checked').each(function () {
            courseHours.push(this.value);
        });
        $('.find-a-course-page #courseStudyTime input[type=checkbox]:checked').each(function () {
            courseStudyTime.push(this.value);
        });

        var paramValues = {
            SearchTerm: searchTerm,
            Distance: distance,
            Town: town,
            OrderByValue: orderByValue,
            StartDate: startDate,
            CourseType: courseType.toString(),
            CourseHours: courseHours.toString(),
            CourseStudyTime: courseStudyTime.toString(),
            FilterA: true,
            Page: parseInt(page)
        };

        return paramValues;
    }
});