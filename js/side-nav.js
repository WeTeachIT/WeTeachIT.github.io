/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "230px";
    document.getElementById("myFooter").style.marginLeft = "230px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myFooter").style.marginLeft = "0";
}


// Add active class to the current button (highlight it)
var header = document.getElementById("mySidenav");
var btns = header.getElementsByTagName("a");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("act");
        current[0].className = current[0].className.replace(" act", "");
        this.className += " act";
    });
}


var btn = $('#btn-btt');

$(window).scroll(function () {
    if ($(window).scrollTop() > 725) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
});



