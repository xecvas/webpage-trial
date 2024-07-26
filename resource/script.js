// Show current date on console
console.log(new Date());

// Initialize DataTables for both tables on page load
$(document).ready(function() {
  $('#example').DataTable();
  $('#example2').DataTable();
});

// Initialize tabs functionality on page load
$(document).ready(function() {
  // Main tabs
  $('#myTab a').on('click', function(e) {
    e.preventDefault();
    $(this).tab('show');
    $('#myTab a').removeClass('active');
    $(this).addClass('active');
  });

  // Child tabs
  $('#myTab2 a').on('click', function(e) {
    e.preventDefault();
    $(this).tab('show');
    $('#myTab2 a').removeClass('active');
    $(this).addClass('active');
    $('#test-tab').addClass('active');
  });

  // Ensure the "test" tab remains active when any child tab is clicked
  $('#myTab2 a').on('shown.bs.tab', function() {
    $('#test-tab').addClass('active');
  });
});

// Toggle dark mode functionality
$(document).ready(function() {
  const checkbox = document.getElementById("checkbox");

  checkbox.addEventListener("change", function() {
    $('body, canvas, form-text').toggleClass('dark');
  });

  // Load and apply the saved toggle setting from localStorage
  const loadToggleSetting = () => {
    const isChecked = JSON.parse(localStorage.getItem("isChecked"));
    if (isChecked) {
      checkbox.checked = isChecked;
      $('body, canvas, form-text').addClass('dark');
    }
  };

  // Save the toggle setting to localStorage
  const saveToggleSetting = () => {
    localStorage.setItem("isChecked", JSON.stringify(checkbox.checked));
  };

  // Apply saved setting and set up event listener to save changes
  loadToggleSetting();
  $("#checkbox").change(saveToggleSetting);
});

// Remember me functionality for login form
window.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  if (username && password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('rememberMe').checked = true;
  }

  // Save or clear login details based on 'Remember me' checkbox state
  document.getElementById('rememberMe').addEventListener('change', function() {
    if (this.checked) {
      localStorage.setItem('username', document.getElementById('username').value);
      localStorage.setItem('password', document.getElementById('password').value);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  });
});
