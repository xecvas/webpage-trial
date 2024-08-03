$(document).ready(function () {
  // Initialize DataTables on specified tables
  var table = $("#myDataTable").DataTable();

  // Initialize tabs and their functionalities
  initTabs("#myTab", table);  // Parent tab 1
  initTabs("#myTab2", table); // Parent tab 2
  initTabs("#myTab3", table); // Parent tab 3
  initTabs(".child-tab", table); // Child tabs

  // Define common event handlers
  function clearSearch() {
    table.search('').columns().search('').draw();
  }

  function columnSearch(columnIndex, searchTerm) {
    table.column(columnIndex).search(searchTerm).draw();
  }

  // Set up tab click events
  setTabClickEvents('#home-tab, #deliver-tab, #payment-tab', clearSearch);
  setTabClickEvents('#child1-tab', function() { columnSearch(2, ''); });
  setTabClickEvents('#child2-tab', function() { columnSearch(2, 'delivered'); });
  setTabClickEvents('#child3-tab', function() { columnSearch(2, 'pending'); });
  setTabClickEvents('#child4-tab', function() { columnSearch(2, 'canceled'); });
  setTabClickEvents('#child5-tab', function() { columnSearch(2, 'on process'); });
  setTabClickEvents('#paymentchild1-tab', function() { columnSearch(3, ''); });
  setTabClickEvents('#paymentchild2-tab', function() { columnSearch(3, 'paymented'); });
  setTabClickEvents('#paymentchild3-tab', function() { columnSearch(3, 'pending'); });
  setTabClickEvents('#paymentchild4-tab', function() { columnSearch(3, 'canceled'); });
  setTabClickEvents('#paymentchild5-tab', function() { columnSearch(3, 'on process'); });

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

  // Logout button functionality
  $('#logoutBtn').click(function() {
      // Add your logout logic here
      // For example, redirect to login page
      window.location.href = 'index.html';
  });
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

// Function to set up click events for tabs
function setTabClickEvents(selector, callback) {
  $(selector).click(callback);
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
