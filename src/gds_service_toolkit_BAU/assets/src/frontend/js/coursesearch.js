(function () {
    'use strict';
 

    setTimeout(
  function () {
      var refinementFailed = $("#RefinementFailed");
      if ($(refinementFailed[0]).val() === "True") {
          $("details").attr("open", true);
          $("#details-content-0").attr("aria-hidden", false);
          $("#details-content-0").attr("style", "");
          $(".arrow").removeClass("arrow-closed").addClass("arrow-open");
          $("#radio-date").click();
      }
  }, 2000);

    var startDate = $("#CurrentSearchRequest_StartDate").val();
    if (startDate) {
        if (startDate.toLowerCase() === "anytime") {
            $("#radio-anytime").click();

        } else if (startDate.toLowerCase() === "today") {
            $("#radio-today").click();
        }
        else {
            $("#radio-date").click();
            $("#select-date").removeClass("js-hidden");
        }
    }

    $(".locationfield").on('change keyup keydown blur input', function () {
        var locationRegex = $('.locationRegex').first().val();
        var regex = new RegExp(locationRegex);
        var value = $(".locationfield").first().val();
        if (value) {
            if (regex.test(value)) {
                $("#distanceFormGroup").show();
            } else {
                $("#distanceFormGroup").hide();
            }
        }
        else if (value === "") {
            $("#distanceFormGroup").hide();
        }
    });

    $("#courseLanding").submit(function (event) {
        var validator = $("#courseLanding").validate();
        if (!validator.valid()) {
            $(".field-validation-error").closest(".form-group").addClass("error");
            event.preventDefault();
        }
    });
})();


