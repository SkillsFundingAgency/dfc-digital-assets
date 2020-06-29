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
        if (window.location.pathname.endsWith(this.pathForWebchat) || window.location.pathname.endsWith(this.pathForlocalWebchat)) {
            this.initialiseWebchatView();
        }
        if (window.location.pathname.endsWith(this.pathForEnterYourDetails) || window.location.pathname.endsWith(this.pathForlocalEnterYourDetails)) {
            this.initialisEnterYourDetailsView();
        }
    }

    initialiseWebchatView() {
        //Have to inject the iFrame as we cant have html in the <script> block
        //<noscript> iFrame in the markup is use when no JS
        var chatUrl = document.getElementById('ChatUrl');
        if (chatUrl) {
            var iFrameContainer = document.getElementById('chatcontainer');
            if (iFrameContainer) {
                var iFrame = document.createElement('iframe');
                iFrame.setAttribute('id', 'webchatframe');
                iFrame.src = chatUrl.value;                     // + '?GAID=' + CompUiUtilties.getCookie('_ga');
                iFrame.classList = 'dfc-app-contact-us-Webchat';
                iFrame.scrolling = 'no';
                iFrame.title = 'webchat';

                iFrameContainer.appendChild(iFrame);
                iFrameContainer.style.cssText = 'width:100%; height: 1200px; -webkit-overflow-scrolling:touch';
            }
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
