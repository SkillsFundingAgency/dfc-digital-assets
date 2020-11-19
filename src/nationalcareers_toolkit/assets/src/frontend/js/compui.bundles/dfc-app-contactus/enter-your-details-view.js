var EnterYourDetailsView = function () { }

EnterYourDetailsView.prototype = {
    initialise: function () {
        var paths = ["/contact-us/enter-your-details", "/pages/enter-your-details"];

        if (paths.indexOf(window.location.pathname.toLowerCase()) > -1) {
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
    }
}

var enterYourDetailsView = new EnterYourDetailsView();
enterYourDetailsView.initialise();