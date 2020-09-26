
// Get the modal
var mymodal = document.getElementById("Modal");
var mymodal1 = document.getElementById("Modal1");

// Get the button that opens the modal
var mybtn = document.getElementById("Btn");
var mybtn1 = document.getElementById("Btn1");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementsByClassName("close1")[0];

// When the user clicks the button, open the modal 
mybtn.onclick = function () {
    mymodal.style.display = "block";
}
mybtn1.onclick = function () {
    mymodal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    mymodal.style.display = "none";
}
span1.onclick = function () {
    mymodal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == mymodal) {
        document.getElementById("Modal").style.display = "none";
    }
    if (event.target == mymodal1) {
        document.getElementById("Modal1").style.display = "none";
    }
}