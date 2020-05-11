 $(document).ready(function () {

        var form = $(".validationOnClient");
        var errorSummary = $(".govuk-error-summary");
        var hiddenClass = "govuk-visually-hidden";
        var formErrorClass = "govuk-form-group--error";
        var inputErrorClass = "govuk-input--error";

        function findItem(list, itemToFind) {
            var itemToRemove = {}
            $(list).each(function () {
                if (($(this).attr("id") === $(itemToFind).attr("name"))) {
                    itemToRemove = this;
                }
            });
            return itemToRemove;
        }

        function toggleErrorSummary(hasErrors) {
            toggleFormErrorClass(hasErrors);
            var hidden = errorSummary.hasClass(hiddenClass);

            if (hasErrors && hidden) {
                errorSummary.removeClass(hiddenClass);
            } else if (!hasErrors && !hidden) {
                errorSummary.addClass(hiddenClass);
            }
        }

        function removeItem(item) {

            if ($(item).length > 0) {
                $(item).remove();
            }
        }


        function toggleItemErrorClass(item, hasError) {
            var errorClass = $(item).hasClass(inputErrorClass);

            if (hasError && errorClass) {
                $(item).addClass(inputErrorClass);
            } else if (!hasError && !errorClass) {
                $(item).removeClass(inputErrorClass);
            }
        }

        function toggleFormErrorClass(hasErrors) {
            var errorClass = form.hasClass(formErrorClass);

            if (hasErrors && errorClass) {
                $(form).addClass(formErrorClass);
            } else if (!hasErrors && !errorClass) {
                $(form).removeClass(formErrorClass);
            }
        }

        function updateErrorDetails(item, errorMsg, hasError) {
            var listParent = $("ul.govuk-list.govuk-error-summary__list");
            var list = $("ul.govuk-list.govuk-error-summary__list").children("li");
            if (hasError === true) {

                if (list.length > 0) {
                    removeItem(findItem(list, item));
                }
                var itemName = $(item).attr("name");
                $(listParent).append('<li id="' + $(item).attr("name") + '">' + '<a href="#' + itemName.split(".").join("_") + '">' + errorMsg + '</a></li>');
                toggleItemErrorClass(item, true);

            } else {
                toggleItemErrorClass(item, false);
                if (list.length > 0) {
                    removeItem(findItem(list, item));
                }
            }
            toggleErrorSummary($("ul.govuk-list.govuk-error-summary__list").children("li").length > 0);

        }

        function focusout(event) {
            var validationMsg = $(this.parentNode).children("span.govuk-error-message.field-validation-error");

            updateErrorDetails(this, validationMsg.text(), validationMsg.length > 0);
        }



        $("form.validationOnClient :input").each(function () {
            var input = $(this);
            input.on("blur", focusout);
        });
    });