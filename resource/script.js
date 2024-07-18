// script.js

$(document).ready(function() {
    const checkbox = document.getElementById("checkbox");

    checkbox.addEventListener("change", function() {
        $('body').toggleClass('dark');
        $('canvas').toggleClass('dark');
        $('form-text').toggleClass('dark');
    });
});
