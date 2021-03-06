﻿var dfc = (dfc || {});
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
    ConditionalDistanceDropDownDisplay($(this));
});

ConditionalDistanceDropDownDisplay();

/* Add feedback link to job profile thumbs up and down survey */
if ($('#job-profile-feedback-survey').length > 0) {
    /* Add feedback link to job profile thumbs up and down survey */
    var originUrl = $("#job-profile-feedback-survey").attr("href");
    var url = originUrl + "?url=" + window.location.href;
    document.getElementById("job-profile-feedback-survey").setAttribute("href", url)
}

/* Pre-search-filter - Skip link */
$(".skip-filter").click(function () {
    $('#continueForm input:checked').not(".filter-na").prop('checked', false);
    $('#continueForm').submit();
});


/* Pre Serch filters - skills count */
var skillsCheckboxes = $("#accordion-filter-skills-list input[type=checkbox]");
skillsCheckboxes.each(function () {
  $(this).change(updateCount);
});

function updateCount() {
	var target = $(this),
	parent = target.closest('.govuk-accordion__section'),
	checked = parent.find('input[type="checkbox"]:checked'),
	checkedAll = $('#accordion-filter-skills-list input[type="checkbox"]:checked').length,
	sectionCount = parent.find('.section-count'),

	sectionCountLength = checked.length,
	count = $("#count span");

	count.text(checkedAll);
	sectionCount.text(sectionCountLength).toggle(sectionCountLength > 0);
}

/* retain skills selection on browser back or forward*/
$(window).on("load", function() {
	updateCount();

	/* accordion section selected checkbox count again */
	var accordionSection = $('#accordion-filter-skills-list .govuk-accordion__section');
	accordionSection.each(function () {
  	var sectionCheckedLength = $(this).find('input[type="checkbox"]:checked').length;
		$(this).find('.section-count').text(sectionCheckedLength).toggle(sectionCheckedLength > 0);
	});
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
                data: { 'term': searchTerm, 'maxNumberDisplayed': $('.js-autocomplete').data("autocomplete-maxnumberdisplyed"), 'fuzzySearch': $('.js-autocomplete').data('autocomplete-fuzzysearch') },
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: $(this).data('autocomplete-minlength')
    });
});

function ConditionalDistanceDropDownDisplay(locationField) {
    locationField = locationField || $(".locationfield");
    var locationRegex = locationField.data("val-postcode");
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
}

function watchForHover() {
    var hasHoverClass = false;
    var container = document.body;
    var lastTouchTime = 0;

    function enableHover() {
        if (new Date() - lastTouchTime < 500) return;
        if (hasHoverClass) return;

        container.className += ' hasHover';
        hasHoverClass = true;
    }

    function disableHover() {
        if (!hasHoverClass) return;

        container.className = container.className.replace(' hasHover', '');
        hasHoverClass = false;
    }

    function updateLastTouchTime() {
        lastTouchTime = new Date();
    }

    document.addEventListener('touchstart', updateLastTouchTime, true);
    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);

    enableHover();
}

watchForHover();
