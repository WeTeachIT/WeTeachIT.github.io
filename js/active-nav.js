
$(document).ready(function () {
    $("#pop1 , #pop2 , #pop3 , #pop4 , #pop5").toggle();
    $("#btn1").click(function () {
        $("#pop1").toggle();
    });
    $("#btn2").click(function () {
        $("#pop2").toggle();
    });
    $("#btn3").click(function () {
        $("#pop3").toggle();
    });
    $("#btn4").click(function () {
        $("#pop4").toggle();
    });
    $("#btn5").click(function () {
        $("#pop5").toggle();
    });

    $('#a1').addClass('active');
    $('div#mySidenav a').click(function () {
        $('div#mySidenav a').removeClass('active');
        $(this).addClass('active');
    });
});

