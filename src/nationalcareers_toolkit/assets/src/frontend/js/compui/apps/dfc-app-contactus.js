var DfcAppContactUs = function () {
    this.compUiPathForContatUs = 'contact-us';
    this.compUiPathForEnterYourDetails = 'enter-your-details';
    this.pathForEnterYourDetails = '/' + this.compUiPathForContatUs + '/' + this.compUiPathForEnterYourDetails;
    this.pathForlocalEnterYourDetails = '/pages/' + this.compUiPathForEnterYourDetails;
}

DfcAppContactUs.prototype = {
    initialise: function () {
        if (window.location.pathname.toLowerCase() == this.pathForEnterYourDetails || window.location.pathname.toLowerCase() == this.pathForlocalEnterYourDetails) {
            this.initialisEnterYourDetailsView();
        }
    },

    initialisEnterYourDetailsView: function () {
        var outerThis = this;

        $('input[name="CallbackDateOptionSelected"]').change(function () {
            outerThis.disableCallbackTimeOptions();
        });

        outerThis.disableCallbackTimeOptions();
    },

    disableCallbackTimeOptions: function () {
        $('input[name="CallbackTimeOptionSelected"]').each(function () {
            var isDisabled = false;

            if ($("input[name='CallbackDateOptionSelected']:checked").val() === 'Today') {
                isDisabled = $(this).data('disabled') === 'True';
            }

            $(this).attr('disabled', isDisabled);
        });
    },
}