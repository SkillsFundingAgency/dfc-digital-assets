class DfcAppContactUs {
    constructor() {
        this.compUiPathForContatUs = 'contact-us';
        this.compUiPathForWebchat = 'webchat';
        this.pathForWebchat = '/' + this.compUiPathForWebchat + '/' + 'chat';
        this.pathForlocalWebchat = '/pages/chat';
        this.compUiPathForEnterYourDetails = 'enter-your-details';
        this.pathForEnterYourDetails = '/' + this.compUiPathForContatUs + '/' + this.compUiPathForEnterYourDetails;
        this.pathForlocalEnterYourDetails = '/pages/' + this.compUiPathForEnterYourDetails;
    }

    initialise() {

        if (window.location.pathname.endsWith(this.pathForEnterYourDetails) || window.location.pathname.endsWith(this.pathForlocalEnterYourDetails)) {
            this.initialisEnterYourDetailsView();
        }
    }

    initialisEnterYourDetailsView() {
        var outerThis = this;

        $('input[name="CallbackDateOptionSelected"]').change(function () {
            outerThis.disableCallbackTimeOptions();
        });

        outerThis.disableCallbackTimeOptions();
    }

    disableCallbackTimeOptions() {
        $('input[name="CallbackTimeOptionSelected"]').each(function () {
            var isDisabled = false;

            if ($("input[name='CallbackDateOptionSelected']:checked").val() === 'Today') {
                isDisabled = $(this).data('disabled') === 'True';
            }

            $(this).attr('disabled', isDisabled);
        });
    }
}
