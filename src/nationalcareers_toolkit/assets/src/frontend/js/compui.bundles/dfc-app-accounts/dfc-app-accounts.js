jQuery(function() {
    var hash = $(location).prop('hash');
    var hiddenClass = 'govuk-visually-hidden';
    if(hash.toLowerCase().indexOf('error') >= 0){
        $('#normal-message').addClass(hiddenClass);
        $('#error-messaage').removeClass(hiddenClass)
    } 
 })