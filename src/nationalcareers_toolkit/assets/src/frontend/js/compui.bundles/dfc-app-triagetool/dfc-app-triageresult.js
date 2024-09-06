$(document).ready(function () {
    
    $("#applyFilters").click(function () {
        triageOptions();
    });
    function triageOptions() {
        var levelOne = $("#selectedLevelOne").val();
        var levelTwo = $("#selectedLevelTwo").val();

        var apiCall = {
                url: '/api/Ajax/Action',
                path: 'triagetool',
                method: 'triageresult'
            };

            $.ajax({
                type: "GET",
                url: apiCall.url,
                contentType: "application/html",
                dataType: "json",
                data: {
                    path: apiCall.path, method: apiCall.method, appData:"{levelOne:'test'}"
                
                },
                success: function (data) {
                    if (data.isHealthy === true && data.payload != null) {
                        $("#triageResultPanel").html(data.payload);
                    }
                },
                failure: function () {
                    console.log('Failure, Retrieving Triage Tool options');
                    promise.resolve(options);
                },
                error: function () {
                    console.log('Error, Retrieving Triage Tool options');
                    promise.resolve(options);
                }
            });
    }

});