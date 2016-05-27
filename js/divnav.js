//show about and table divs on click
$(document).ready(function () {

    //default: don't see about and table divs
    $('.popup').hide();

    $('#aboutlink').click(function () {
        if ($("#about").is(":visible")) {
            $('#about').hide();
        } else {
            $('#about').show();
        }
    });

    $('#tablelink').click(function () {
        if ($("#table-section").is(":visible")) {
            $('#table-section').hide();
        } else {
            $('#table-section').show();
        }
    });

    $('.divclose').click(function () {
        ($(this).parent()).hide();
    });
});