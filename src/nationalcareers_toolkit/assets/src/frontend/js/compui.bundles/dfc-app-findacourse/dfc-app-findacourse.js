
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

    $('.find-a-course-page #search-input, .find-a-course-page #location-input').keypress(function (e) {
        if (e.which === 13) {
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('.find-a-course-page #search-input, .find-a-course-page #location-input').on("blur", function (e) {
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

    function makeAjaxCall(stringifield) {
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
                let parsedData = JSON.parse(data.payload);
                $('#fac-result-list').html("");
                $('#fac-result-list').html(parsedData.html);
                $('.fac-result-count').html("");
                $('.fac-result-count').html(addCommas(parsedData.count));
                $("#fac-clear-filters").show();
                $(".fac-filters-block").show();
                let searchTerm = $('.find-a-course-page #search-input').val();
                $(".fac-filters-block").html("<p id='fac-clear-filters'><a href='/find-a-course/searchcourse?searchTerm=" + searchTerm + "' aria-label='ClearFilters'>Clear filters</a></p>");
                if (parsedData.isPostcode === true) {
                    $('.find-a-course-page #distance-block').show();
                    $("#orderBy-Input")[0].options.add(new Option("Distance", "Distance"));
                    generateClearLink();
                }
                else {
                    $('.find-a-course-page #distance-block').hide();
                    $(".find-a-course-page #orderBy-Input option[value='Distance']").remove();
                }
            },
            failure: function () {
                console.log('Failure, in ajax call');
            },
            error: function() {
                console.log('Error, calling ajax call');
            }
        });
    }

    function getParams() {
        let orderByValue = $('.find-a-course-page #orderBy-Input').val();
        let searchTerm = $('.find-a-course-page #search-input').val();
        let distance = $('.find-a-course-page #distance-select').val();
        let town = $('.find-a-course-page #location-input').val();
        let startDate = $('.find-a-course-page #startdate-select').val();
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

        let paramValues = {
            SearchTerm: searchTerm,
            Distance: distance,
            Town: town,
            OrderByValue: orderByValue,
            StartDate: startDate,
            CourseType: courseType.toString(),
            CourseHours: courseHours.toString(),
            CourseStudyTime: courseStudyTime.toString()
        };
        let stringified = JSON.stringify(paramValues);
        return stringified;
    }
});