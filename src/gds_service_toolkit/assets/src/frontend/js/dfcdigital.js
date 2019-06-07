var dfc = (dfc || {});
dfc.digital = {
    addFocus: function (identifier) {
        var elm = $(identifier);
        if (elm && elm.val() && elm.val().length > 0) {
            elm.addClass("focus");
        } else {
            elm.removeClass("focus");
        }
    }
};

$(document).ready(function () {
    CookieBanner.addCookieMessage();

    $(".js-search-focus").ready(function () { dfc.digital.addFocus(".js-search-focus"); }).focus(function () { dfc.digital.addFocus(this) }).blur(function () { dfc.digital.addFocus(this) });

    /* Not yet developed
    //Survey Show Hide / Cookie Functionality
    */

    //Filters Non Applicable functinality
    $(".filter-na").change(function () {
        if (this.checked) {
            $('input:checked').not(".filter-na").prop('checked', false);
            this.change;
        }
    });

    $('input:checkbox').not(".filter-na").change(function () {
        if ($(".filter-na").prop('checked')) {
            $(".filter-na").prop('checked', false);
        }
    });

    $(".ga-additional-data").click(function () {
        var validator = $(this).closest('form').validate();

        if (validator.valid()) {

            var key = $(this).data("datalayer-key");

            var inputId = $(this).data("datalayer-input");

            var dataValue = $("input[name=" + inputId + "]:checked").val();

            dataLayer.push({ key: dataValue });

        }
    });

    /*Course Search
    */

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

});

$.extend($.ui.autocomplete.prototype, {
    _resizeMenu: function () {
        this.menu.element.outerWidth(this.element[0].clientWidth);
    }
});

//get all input boxes with class "autocomplete"
$('.js-autocomplete').each(function () {
    $(this).autocomplete({
        source: function (term, response) {
            var searchTerm = term.term;
            var maxnumberCharacters = $('.js-autocomplete').data("autocomplete-maxlength");

            if (searchTerm.length > maxnumberCharacters) {
                return;
            }
            //else : fetch your data, and call the 'response' callback
            $.ajax({
                url: $('.js-autocomplete').data("autocomplete-source"),
                dataType: 'json',
                data: {'term' : searchTerm,  'maxNumberDisplayed' : $('.js-autocomplete').data("autocomplete-maxnumberdisplyed"), 'fuzzySearch' : $('.js-autocomplete').data('autocomplete-fuzzysearch') },
                success: function (data) {
                    response(data);
                }
            });
        }, 
        minLength: $(this).data('autocomplete-minlength')
    });
});

