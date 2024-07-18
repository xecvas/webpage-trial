// script.js

$(document).ready(function() {
    const checkbox = document.getElementById("checkbox");

    checkbox.addEventListener("change", function() {
        $('body').toggleClass('dark');
        $('canvas').toggleClass('dark');
        $('form-text').toggleClass('dark');
    });
});

// Save toggle setting to localStorage
function saveToggleSetting() {
  const checkbox = document.getElementById("checkbox");
  const isChecked = checkbox.checked;
  localStorage.setItem("isChecked", JSON.stringify(isChecked));
}

// Load toggle setting from localStorage
function loadToggleSetting() {
  const checkbox = document.getElementById("checkbox");
  const isChecked = JSON.parse(localStorage.getItem("isChecked"));
  if (isChecked) {
    checkbox.checked = isChecked;
    $('body').addClass('dark');
    $('canvas').addClass('dark');
    $('form-text').addClass('dark');
  }
}

$(document).ready(function() {
  loadToggleSetting();
  saveToggleSetting();
  $("#checkbox").change(saveToggleSetting);
});
