/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "225px";
    document.getElementById("myFooter").style.marginLeft = "225px";
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

