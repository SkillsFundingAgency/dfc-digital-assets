$(document).ready(function () {

    $('#all-ypfc-button').on('click', function (e) {
        $('.work').show();
        $('.workandstudy').show();
        $('.study').show();
        e.preventDefault();
        return false;
    });

    $('#combined-ypfc-button').on('click', function (e) {
        $('.work').hide();
        $('.workandstudy').show();
        $('.study').hide();
        e.preventDefault();
        return false;
    });

    $('#study-ypfc-button').on('click', function (e) {
        $('.work').hide();
        $('.workandstudy').hide();
        $('.study').show();
        e.preventDefault();
        return false;
    });

    $('#work-ypfc-button').on('click', function (e) {
        $('.work').show();
        $('.workandstudy').hide();
        $('.study').hide();
        e.preventDefault();
        return false;
    });
}