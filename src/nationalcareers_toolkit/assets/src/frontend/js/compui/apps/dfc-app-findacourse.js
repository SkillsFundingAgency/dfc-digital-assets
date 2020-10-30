
$(document).ready(function () {
    $('#orderBy-Input, #distance-select, #startdate-select').on('change', function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('#search-input, #location-input').keypress(function (e) {
        if (e.which === 13) {
            makeAjaxCall(getParams());
            e.preventDefault();
            return false;
        }
    });

    $('#search-input, #location-input').on("blur", function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $('#courseType input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('#courseHours input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });
    $('#courseStudyTime input[type=checkbox]').change(function (e) {
        makeAjaxCall(getParams());
        e.preventDefault();
        return false;
    });

    $("form").submit(function (e) {
        return false;
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
                $('#result-list').html("");
                $('#result-list').html(parsedData.html);
                $('.result-count').html("");
                $('.result-count').html(addCommas(parsedData.count));
            },
            failure: function (jqXHR, textStatus, errorThrown) {
                alert('Failure');
            },
            error: function (data) {
                alert('error');
            }
        });
    }

    function getParams() {
        let orderByValue = $('#orderBy-Input').val();
        let searchTerm = $('#search-input').val();
        let distance = $('#distance-select').val();
        let town = $('#location-input').val();
        let startDate = $('#startdate-select').val();
        var courseType = [];
        var courseHours = [];
        var courseStudyTime = [];
        $('#courseType input[type=checkbox]:checked').each(function () {
            courseType.push(this.value);
        });
        $('#courseHours input[type=checkbox]:checked').each(function () {
            courseHours.push(this.value);
        });
        $('#courseStudyTime input[type=checkbox]:checked').each(function () {
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