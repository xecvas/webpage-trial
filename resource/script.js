//show current date on console
var MyDate = new Date();
console.log(MyDate);

//datatable
$(document).ready(function() {
  $('#example').DataTable();
});

//tabs
$(document).ready(function() {
  $('#myTab a').on('click', function (e) {
      e.preventDefault();
      $(this).tab('show');

      // Remove active classes from all tabs
      $('.nav-link').removeClass('active');

      // Add active class to clicked tab
      $(this).addClass('active');
  });
});

//toggle dark mode
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

// Load toggle setting from localStorage
$(document).ready(function() {
  loadToggleSetting();
  saveToggleSetting();
  $("#checkbox").change(saveToggleSetting);
});

//remember me function
function toggleRememberMe(checkbox) {
  if (checkbox.checked) {
    // Remember the user
    localStorage.setItem('username', document.getElementById('username').value);
    localStorage.setItem('password', document.getElementById('password').value);
  } else {
    // Forget the user
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }
}

// Check if the user is remembered
window.addEventListener('DOMContentLoaded', function() {
  var username = localStorage.getItem('username');
  var password = localStorage.getItem('password');
  if (username && password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('rememberMe').checked = true;
  }
});
