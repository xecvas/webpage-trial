$(document).ready(function () {
  // Initialize DataTables on specified tables
  $("#myDataTable").DataTable();

  $("#child2-tab").click(function () {
    var table = $("#myDataTable").DataTable();
    table.search("delivered").draw();
  });

// Click event for all other tabs to reset the table search
$('a[data-toggle="tab"]').not('#child2-tab').click(function() {
  var table = $('#myDataTable').DataTable();
  table.search('').draw();  // Reset the search filter
});

//BIKIN TAB ACTIVE RESET GITU PARENT TAB GANTI KE CHILD TAB LAIN ATAU KE PARENT TAB LAIN
//BIKIN SORT BUAT MODE YG LAIN
//FIX CODE LAIN BIAR LEBIH EFISIEN DAN GAMPANG DI BACA

  // Function to initialize tab functionality
  function initTabs(tabSelector) {
    $(tabSelector + " a").on("click", function (e) {
      e.preventDefault();
      $(this).tab("show");
      $(tabSelector + " a").removeClass("active");
      $(this).addClass("active");
    });
  }

  // Initialize tabs
  initTabs("#myTab");
  initTabs("#myTab2");
  initTabs("#myTab3");

  // Toggle dark mode functionality
  const checkbox = document.getElementById("checkbox");

  // Load and apply the saved toggle setting from localStorage
  function loadToggleSetting() {
    const isChecked = JSON.parse(localStorage.getItem("isChecked"));
    if (isChecked) {
      checkbox.checked = isChecked;
      $("body, canvas, form-text").addClass("dark");
    }
  }

  // Save the toggle setting to localStorage
  function saveToggleSetting() {
    localStorage.setItem("isChecked", JSON.stringify(checkbox.checked));
  }

  // Event listener for checkbox to toggle dark mode and save the setting
  checkbox.addEventListener("change", function () {
    $("body, canvas, form-text").toggleClass("dark");
    saveToggleSetting();
  });

  // Apply saved setting
  loadToggleSetting();

  // Remember me functionality for login form
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (username && password) {
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("rememberMe").checked = true;
  }

  // Save or remove credentials based on the checkbox state
  document.getElementById("rememberMe").addEventListener("change", function () {
    if (this.checked) {
      localStorage.setItem(
        "username",
        document.getElementById("username").value
      );
      localStorage.setItem(
        "password",
        document.getElementById("password").value
      );
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  });

  // Show current date on console
  console.log(new Date());
});

$(document).ready(function () {
  // Initialize DataTable (you can customize options)
  $("#myDataTable").DataTable();

  // Tab click handler
  $('a[data-bs-toggle="tab"]').on("shown.bs.tab", function (e) {
    // Hide DataTable in all containers
    $(".dataTableContainer").hide();
    // Show DataTable in the clicked tab
    $("#myDataTable").appendTo($(e.target).attr("href")).show();
  });
});
