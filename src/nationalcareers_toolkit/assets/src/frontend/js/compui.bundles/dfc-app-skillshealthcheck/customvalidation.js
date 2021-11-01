$(function () { $(".disable-button-onclick").click(function() {
    $(this).prop('disabled', true);
    if (!$(this).parents('form').valid()) {
        $(this).prop("disabled", false);
        return false;
    }
    $(this).parents('form').submit();
}) });

$.validator.unobtrusive.adapters.add('requiredifdependentnotempty', ['dependentproperty'], function (options) {
    options.rules['requiredifdependentnotempty'] = options.params;
    options.messages['requiredifdependentnotempty'] = options.message;
});

$.validator.addMethod('requiredifdependentnotempty', function (value, element, parameters) {
    var controlType = $("input[id$='" + parameters.dependentproperty + "']").attr("type");
    var actualvalue = {}
    if (controlType == "checkbox" || controlType == "radio") {
        var control = $("input[id$='" + parameters.dependentproperty + "']:checked");
        actualvalue = control.val();
    } else {
        actualvalue = $("#" + parameters.dependentproperty).val();
    }
    var v = $.trim(actualvalue).toLocaleLowerCase();
    if (v != null && v != '') {
        var isValid = $.validator.methods.required.call(this, value, element, parameters);
        return isValid;
    }
    return true;
});


$.validator.unobtrusive.adapters.add('requiredifdependentvalueequals', ['dependentproperty', 'desiredvalue'], function (options) {
    options.rules['requiredifdependentvalueequals'] = options.params;
    options.messages['requiredifdependentvalueequals'] = options.message;
});

$.validator.addMethod('requiredifdependentvalueequals', function (value, element, parameters) {
    var desiredvalue = parameters.desiredvalue;
    desiredvalue = (desiredvalue == null ? '' : desiredvalue).toString();
    var controlType = $("input[id$='" + parameters.dependentproperty + "']").attr("type");
    var actualvalue = {}

    if (typeof (controlType) === 'undefined') {
        controlType = $("input[name$='" + parameters.dependentproperty + "']").attr("type");
    }
    if (controlType == "checkbox" || controlType == "radio") {
        var control = $("input[id$='" + parameters.dependentproperty + "']:checked");
        if (control.length == 0) {
            control = $("input[name$='" + parameters.dependentproperty + "']:checked");
        }
        actualvalue = control.val();
    } else {
        actualvalue = $("#" + parameters.dependentproperty).val();
    }

    if ($.trim(desiredvalue).toLowerCase() === $.trim(actualvalue).toLocaleLowerCase()) {
        var isValid = $.validator.methods.required.call(this, value, element, parameters);
        return isValid;
    }
    return true;
});

$.validator.unobtrusive.adapters.add('atleastonerequired', ['properties'], function (options) {
        options.rules['atleastonerequired'] = options.params;
        options.messages['atleastonerequired'] = options.message;
    }
);

$.validator.addMethod('atleastonerequired', function (value, element, params) {
    var properties = params.properties.split(',');
    var values = $.map(properties, function (property, index) {
        var val = $('#' + property).val();
        return val != '' ? val : null;
    });
    return values.length > 0;
}, '');

$.validator.setDefaults({
    highlight: function (element) {
        if ($(element).attr('id') == "DateOfBirthDay" || $(element).attr('id') == "DateOfBirthMonth" || $(element).attr('id') == "DateOfBirthYear"
            || $(element).attr('id') == "Identity_PersonalDetails_DateOfBirthDay" || $(element).attr('id') == "Identity_PersonalDetails_DateOfBirthMonth" || $(element).attr('id') == "Identity_PersonalDetails_DateOfBirthYear"
        ) {
            $('#divDOB').addClass("error");
        }
        else if ($(element).attr('id') == "CurrentSearchRequest_StartDateDobModel_Day" || $(element).attr('id') == "CurrentSearchRequest_StartDateDobModel_Month" || $(element).attr('id') == "CurrentSearchRequest_StartDateDobModel_Year" || $(element).attr('id') == "CurrentSearchRequest_StartDateDobModel_SelectedDateFrom") {
            $('#select-date').addClass("govuk-form-group--error");
        }
        else {
            var groupElement = $(element).closest(".form-group").addClass("govuk-form-group--error");
        }

        // The code bellow probably is not used
        var validator = this;
        $('form .govuk-error-summary ul li').each(function () {
            var liItem = $(this);
            if (liItem.find('a').length == 0) {
                var errorMessage = liItem.html();
                var elementLink = '#';

                $.each(validator.errorList, function (index, item) {
                    if (item.message == errorMessage) {
                        var itemElementId = $(item.element).attr('id');
                        var itemGroupElementId = $(item.element).data('fieldgroup');

                        if (typeof (itemGroupElementId) !== 'undefined' && itemGroupElementId != '') {
                            elementLink = '#' + itemGroupElementId;
                        } else {
                            elementLink = '#' + itemElementId;
                        }
                    }
                });

                liItem.html('<a href="' + elementLink + '">' + errorMessage + '</a>');
            }
        });
    },
    unhighlight: function (element) {
        if ($(element).attr('id') == "DateOfBirthDay" || $(element).attr('id') == "DateOfBirthMonth" || $(element).attr('id') == "Identity_PersonalDetails_DateOfBirthDay" || $(element).attr('id') == "Identity_PersonalDetails_DateOfBirthMonth") {

            var otherValidationErrors = $("#divDOB").find(".field-validation-error");

            if (otherValidationErrors.length === 0) {
                $('#divDOB').removeClass("error");
            }
        }
        if ($(element).attr('id') == "CurrentSearchRequest_StartDateDobModel_SelectedDateFrom") {
            $('#select-date').removeClass("govuk-form-group--error");
        }
        else {
            $(element).closest(".form-group").removeClass("govuk-form-group--error");
        }
    }
});


$(document).ready(function () {

    if ($.validator && $.validator.methods && $.validator.methods.maxlength) {

        $.validator.methods.maxlength = function (value, element, param) {
            if (typeof value === 'string') {
                value = value.replace(/\r?\n/g, "..");
            }

            var length = $.isArray(value) ? value.length : $.validator.prototype.getLength($.trim(value), element);
            return $.validator.prototype.optional(element) || length <= param;
        };
    }


    $("textarea[data-val-length-max]").keyup(function () {
        //SQL considers newline as 2 characters, so client validation is accommodated properly
        var lineBreaks = $(this).val().split('\n').length - 1;
        var charLength = $(this).val().length + lineBreaks;

        var charLimit = $(this).attr("data-val-length-max");
        var charRemaining = charLimit - charLength;
        if (charRemaining < 0) {
            $(this).next("p").html("<strong>You may only have up to " + charLimit + " characters.</strong>");
        } else {
            $(this).next("p").html(charRemaining + " characters remaining (limit is " + charLimit + " characters)");
        }
    });

    $('.block-label > input:radio').bind('change', function () {
        $('.block-label > input:radio').each(function (i, el) {
            var isChecked = $(el).is(':checked');
            var hasFocus = $(el).is(':focus');
            var parentElement = $(el).parent('.block-label');
            parentElement.toggleClass('selected', isChecked);
            parentElement.toggleClass('focused', hasFocus);
        });
    });

    $('input:radio[name=IsAboutSpecificPage]').change(function () {
        var value = $(this).filter(':checked').val();
        $('input:text[name=PageUrl]').prop('disabled', value == 'False');
        $('input:text[name=PageUrl]').valid();
    });

    $('input:text[name=PageUrl]').prop('disabled', $('input:radio[name=IsAboutSpecificPage]:checked').val() == 'False');
});


//// *** Custom Attributes area ***
jQuery.validator.addMethod("enforcetrue", function (value, element, param) {
    return element.checked;
});

jQuery.validator.unobtrusive.adapters.addBool("enforcetrue");


jQuery.validator.addMethod("doubleregex", function (value, element, param) {
    var firstRegex = param["firstregex"];
    var secondRegex = param["secondregex"];
    var drErrorMessage = param["drerrormessage"];
    var isAndOperator = param["isandoperator"];
    var isDrRequired = param["isdrrequired"];

    var failedPatternErrorMessages = new Array();

    if (isDrRequired === "False" && (value == "" || value == null || value == undefined)) {
        return true;
    }
    else {
        try {
            var firstMatch = new RegExp(firstRegex).exec(value);
            var secondMatch = new RegExp(secondRegex).exec(value);

            if (isAndOperator === "True") {

                if (firstMatch && secondMatch) {
                    return true;
                }
                else {
                    failedPatternErrorMessages[0] = drErrorMessage;
                }
            }
            else {

                if (firstMatch || secondMatch) {
                    return true;
                }
                else {
                    failedPatternErrorMessages[0] = drErrorMessage;
                }
            }
        }
        catch (err) {
            //console.log(err);
            return true;
        }
    }

    if (failedPatternErrorMessages.length > 0) {
        $.validator.messages.doubleregex = failedPatternErrorMessages.toString();
        return false;
    }
});

$.validator.unobtrusive.adapters.add('doubleregex', ['firstregex', 'secondregex', 'drerrormessage', 'isandoperator', 'isdrrequired'], function (options) {
    options.rules['doubleregex'] = {
        firstregex: options.params.firstregex,
        secondregex: options.params.secondregex,
        drerrormessage: options.params.drerrormessage,
        isandoperator: options.params.isandoperator,
        isdrrequired: options.params.isdrrequired
    };
});


jQuery.validator.addMethod("agerange", function (value, element, param) {
    if (value == "" || value == null || value == undefined) {
        return true;
    }

    var dates = param["dates"];
    var errormessages = param["errormessages"];
    var failedDatesErrorMessages = new Array();

    var minAge = parseInt(dates[0]);
    var maxAge = parseInt(dates[1]);

    var minAgeErrorMessage = errormessages[0];
    var maxAgeErrorMessage = errormessages[1];
    var invalidAgeErrorMessage = errormessages[2];

    var dateParts = value.split('/');
    var entryDay = parseInt(dateParts[0]);
    var entryMonth = parseInt(dateParts[1]) - 1;
    var entryYear = parseInt(dateParts[2]);
    var entryDate = new Date(entryYear, entryMonth, entryDay);

    if (entryDate.getFullYear() == entryYear && entryDate.getMonth() == entryMonth && entryDate.getDate() == entryDay) {

        if (Object.prototype.toString.call(entryDate) === "[object Date]") {
            // it is a date type
            if (isNaN(entryDate.getTime())) {  // entryDate.valueOf() could also work
                // date is not valid
                failedDatesErrorMessages[0] = invalidAgeErrorMessage;
            }
            else {
                // date is valid
                var minYear = entryYear + minAge;
                var minAgeDate = new Date(minYear, entryMonth, entryDay);

                var maxYear = entryYear + maxAge;
                var maxAgeDate = new Date(maxYear, entryMonth, entryDay);

                var today = new Date();
                today.setHours(0, 0, 0, 0);

                if (minAgeDate > today) {
                    failedDatesErrorMessages[0] = minAgeErrorMessage;
                }
                else if (maxAgeDate < today) {
                    failedDatesErrorMessages[0] = maxAgeErrorMessage;
                }
                else {
                    return true;
                }
            }
        }
        else {
            // not a date
            failedDatesErrorMessages[0] = invalidAgeErrorMessage;
        }
    }
    else {
        // not valid date - day, month, year don't match before and after Date parsing
        failedDatesErrorMessages[0] = invalidAgeErrorMessage;
    }
    if (failedDatesErrorMessages.length > 0) {

        $.validator.messages.agerange = failedDatesErrorMessages.toString();
        return false;
    }
});

$.validator.unobtrusive.adapters.add('agerange', ['dates', 'errormessages'], function (options) {
    options.rules['agerange'] = {
        dates: options.params['dates'].split(' '),
        errormessages: options.params['errormessages'].split(',')
    };
});

jQuery.validator.addMethod("differ", function (value, element, param) {
    if (value == "" || value == null || value == undefined) {
        return true;
    }
    var otherproperties = param["otherproperties"];
    var errormessages = param["errormessages"];
    var failedDifferErrorMessages = new Array();

    var otherPropertyValue = $('#' + otherproperties[0]).val();

    if (value === otherPropertyValue) {
        failedDifferErrorMessages[0] = errormessages[0];
    }
    else {
        return true;
    }

    if (failedDifferErrorMessages.length > 0) {
        $.validator.messages.differ = failedDifferErrorMessages.toString();
        return false;
    }
});

$.validator.unobtrusive.adapters.add('differ', ['otherproperties', 'errormessages'], function (options) {
    options.rules['differ'] = {
        otherproperties: options.params['otherproperties'].split(' '),
        errormessages: options.params['errormessages'].split(',')
    };
});



jQuery.validator.addMethod("daterange", function (value, element, param) {
    if (value == "" || value == null || value == undefined) {
        return true;
    }

    var dates = param["dates"];
    var errormessages = param["errormessages"];
    var failedDatesErrorMessages = new Array();

    var startDateDay = parseInt(dates[0]);
    var endDateDay = parseInt(dates[1]);

    var dateRangeErrorMessage = errormessages[0];
    var invalidErrorMessage = errormessages[1];

    var dateParts = value.split('-');
    var entryYear = parseInt(dateParts[0]);
    var entryMonth = parseInt(dateParts[1]) - 1;
    var entryDay = parseInt(dateParts[2]);
    var entryDate = new Date(entryYear, entryMonth, entryDay);

    if (entryDate.getFullYear() == entryYear && entryDate.getMonth() == entryMonth && entryDate.getDate() == entryDay) {

        if (Object.prototype.toString.call(entryDate) === "[object Date]") {
            // it is a date type
            if (isNaN(entryDate.getTime())) {  // entryDate.valueOf() could also work
                // date is not valid
                failedDatesErrorMessages[0] = invalidErrorMessage;
            }
            else {
                // date is valid
                var validStartDate = new Date();
                validStartDate.setDate(validStartDate.getDate() - startDateDay - 1);
                var validEndDate = new Date();
                validEndDate.setDate(validEndDate.getDate() + endDateDay);

                if (entryDate >= validStartDate && entryDate <= validEndDate) {
                    return true;
                }
                else {
                    failedDatesErrorMessages[0] = dateRangeErrorMessage;
                }
            }
        }
        else {
            // not a date
            failedDatesErrorMessages[0] = invalidErrorMessage;
        }
    }
    else {
        // not valid date - day, month, year don't match before and after Date parsing
        failedDatesErrorMessages[0] = invalidErrorMessage;
    }

    if (failedDatesErrorMessages.length > 0) {

        $.validator.messages.daterange = failedDatesErrorMessages.toString();
        return false;
    }
});

$.validator.unobtrusive.adapters.add('daterange', ['dates', 'errormessages'], function (options) {
    options.rules['daterange'] = {
        dates: options.params['dates'].split(' '),
        errormessages: options.params['errormessages'].split(',')
    };
});
