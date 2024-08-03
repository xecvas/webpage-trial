$(document).ready(function () {
  // Initialize DataTables on specified tables
  var table = $("#myDataTable").DataTable();

  // Initialize parent tabs and child tabs
  initTabs("#myTab", table);  // Parent tab 1
  initTabs("#myTab2", table); // Parent tab 2
  initTabs("#myTab3", table); // Parent tab 3
  initTabs(".child-tab", table); // Child tabs

  // Click event for child2-tab to filter DataTable by delivered status
  $("#child2-tab").click(function () {
    table.column(2).search("delivered").draw();
  });

  // Toggle dark mode functionality
  const checkbox = document.getElementById("checkbox");
  loadToggleSetting();
  checkbox.addEventListener("change", function () {
    $("body, canvas, form-text").toggleClass("dark");
    saveToggleSetting();
  });

  // Remember me functionality for login form
  loadCredentials();
  document.getElementById("rememberMe").addEventListener("change", saveOrRemoveCredentials);

  // Show current date on console
  console.log(new Date());
});

// Function to initialize tab functionality
function initTabs(tabSelector, table) {
  $(tabSelector + " a").on("click", function (e) {
    e.preventDefault();
    $(this).tab("show");
    $(tabSelector + " a").removeClass("active");
    $(this).addClass("active");

    // When parent tab changes, activate the child tab with 'active' class
    if ($(this).closest(".parent-tab").length) {
      var parentTabId = $(this).attr("href");
      $(parentTabId).find(".child-tab a.active").tab("show");
    }

    // Explicitly reset the status column filter when switching tabs
    if ($(this).closest(".parent-tab").length || this.id !== "child2-tab") {
      table.column(2).search("").draw();
    }
  });
}

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

// Load credentials from localStorage and set them in the login form
function loadCredentials() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (username && password) {
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("rememberMe").checked = true;
  }
}

// Save or remove credentials based on the checkbox state
function saveOrRemoveCredentials() {
  if (this.checked) {
    localStorage.setItem("username", document.getElementById("username").value);
    localStorage.setItem("password", document.getElementById("password").value);
  } else {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }
}
