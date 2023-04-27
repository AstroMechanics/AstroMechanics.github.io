$(document).ready(function () {
    $('.navigation ul li:first').addClass('active2');
    $('.tab-content:not(:first)').hide();
    $('.navigation ul li a').click(function (event) {
        event.preventDefault();
        var content = $(this).attr('href');
        $(this).parent().addClass('active2');
        $(this).parent().siblings().removeClass('active2');
        $(content).show();
        $(content).siblings('.tab-content').hide();
    });
});
