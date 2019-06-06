function DoSubmitAndDisableSubmitButton(formId, buttonId) {
    $("#" + formId).submit();
    $("." + buttonId).attr("disabled", true);
}