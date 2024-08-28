// Wait until the DOM is fully loaded
$(document).ready(function () {
  // Initialize DataTables on the specified table
  var table = $("#myDataTable").DataTable();

  // Initialize tabs and their functionalities
  initTabs("#myTab", table); // Parent tab 1
  initTabs("#myTab2", table); // Parent tab 2
  initTabs("#myTab3", table); // Parent tab 3
  initTabs(".child-tab", table); // Child tabs

  // Setup click events for different tabs
  setTabClickEvents("#home-tab, #deliver-tab, #payment-tab", clearSearch);
  setTabClickEvents("#child1-tab", function () {
    columnSearch(2, "");
  });
  setTabClickEvents("#child2-tab", function () {
    columnSearch(2, "delivered");
  });
  setTabClickEvents("#child3-tab", function () {
    columnSearch(2, "pending");
  });
  setTabClickEvents("#child4-tab", function () {
    columnSearch(2, "canceled");
  });
  setTabClickEvents("#child5-tab", function () {
    columnSearch(2, "on process");
  });
  setTabClickEvents("#paymentchild1-tab", function () {
    columnSearch(3, "");
  });
  setTabClickEvents("#paymentchild2-tab", function () {
    columnSearch(3, "paymented");
  });
  setTabClickEvents("#paymentchild3-tab", function () {
    columnSearch(3, "pending");
  });
  setTabClickEvents("#paymentchild4-tab", function () {
    columnSearch(3, "canceled");
  });
  setTabClickEvents("#paymentchild5-tab", function () {
    columnSearch(3, "on process");
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
  document
    .getElementById("rememberMe")
    .addEventListener("change", saveOrRemoveCredentials);

  // Handle page load from cache
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) window.location.reload();
  });

  // Show current date in the console
  console.log(new Date());

  // Initialize CAPTCHA for login form
  const loginCaptchaCanvas = document.getElementById("loginCaptchaCanvas");
  const loginCaptchaContext = loginCaptchaCanvas.getContext("2d");
  const refreshLoginCaptchaButton = document.getElementById(
    "refreshLoginCaptcha"
  );

  let loginCaptchaText = generateCaptcha(
    loginCaptchaCanvas,
    loginCaptchaContext
  );

  // Event listener for CAPTCHA refresh button in login form
  refreshLoginCaptchaButton.addEventListener("click", function () {
    loginCaptchaText = generateCaptcha(loginCaptchaCanvas, loginCaptchaContext);
  });

  // Event listener for login form submission
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      window.loginCaptchaText = loginCaptchaText; // Make CAPTCHA text accessible
      const formData = new FormData(this);
      formData.append("loginCaptchaHidden", loginCaptchaText); // Add captcha_hidden value to form data
      handleLoginFormSubmit(formData);
    });

  // Initialize CAPTCHA for forgot password form
  const forgotCaptchaCanvas = document.getElementById("forgotCaptchaCanvas");
  const forgotCaptchaContext = forgotCaptchaCanvas.getContext("2d");
  const refreshForgotCaptchaButton = document.getElementById(
    "refreshForgotCaptcha"
  );

  let forgotCaptchaText = generateCaptcha(
    forgotCaptchaCanvas,
    forgotCaptchaContext
  );

  // Event listener for CAPTCHA refresh button in forgot password form
  refreshForgotCaptchaButton.addEventListener("click", function () {
    forgotCaptchaText = generateCaptcha(
      forgotCaptchaCanvas,
      forgotCaptchaContext
    );
  });

  // Event listener for forgot password form submission
  document
    .getElementById("forgot-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      window.forgotCaptchaText = forgotCaptchaText; // Make CAPTCHA text accessible
    });

  // Event listener for logout button
  $("#logoutBtn").click(function () {
    handleLogout();
  });
});

// Function to handle login form submission and process response
function handleLoginFormSubmit(formData) {
  fetch("/login", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showModalAndRedirect("loginSuccess", "/main");
      } else if (data.error === "captcha") {
        showModal("captchaError");
      } else {
        showModal("loginFailed");
      }
    })
    .catch((error) => console.error("Login failed:", error));
}

// Function to initialize tab functionality
function initTabs(tabSelector, table) {
  $(tabSelector + " a").on("click", function (e) {
    e.preventDefault();
    $(this).tab("show");
    $(tabSelector + " a").removeClass("active");
    $(this).addClass("active");

    // Activate the child tab with 'active' class when parent tab changes
    if ($(this).closest(".parent-tab").length) {
      var parentTabId = $(this).attr("href");
      $(parentTabId).find(".child-tab a.active").tab("show");
    }

    // Reset the status column filter when switching tabs
    if ($(this).closest(".parent-tab").length || this.id !== "child2-tab") {
      table.column(2).search("").draw();
    }
  });
}

// Function to set up click events for tabs
function setTabClickEvents(selector, callback) {
  $(selector).click(callback);
}

// Function to clear DataTable search filters
function clearSearch() {
  $("#myDataTable").DataTable().search("").columns().search("").draw();
}

// Function to search a specific column in DataTable
function columnSearch(columnIndex, searchTerm) {
  $("#myDataTable").DataTable().column(columnIndex).search(searchTerm).draw();
}

// Function to load and apply the saved toggle setting from localStorage
function loadToggleSetting() {
  const isChecked = JSON.parse(localStorage.getItem("isChecked"));
  if (isChecked) {
    document.getElementById("checkbox").checked = isChecked;
    $("body, canvas, form-text").addClass("dark");
  }
}

// Function to save the toggle setting to localStorage
function saveToggleSetting() {
  localStorage.setItem(
    "isChecked",
    JSON.stringify(document.getElementById("checkbox").checked)
  );
}

// Function to load credentials from localStorage and set them in the login form
function loadCredentials() {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (username && password) {
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("rememberMe").checked = true;
  }
}

// Function to save or remove credentials based on the checkbox state
function saveOrRemoveCredentials() {
  if (this.checked) {
    localStorage.setItem("username", document.getElementById("username").value);
    localStorage.setItem("password", document.getElementById("password").value);
  } else {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }
}

// Function to handle user logout
function handleLogout() {
  $.ajax({
    url: "/logout",
    type: "GET",
    success: function (response) {
      localStorage.removeItem("isChecked");
      sessionStorage.clear();
      history.replaceState(null, "", "/");
      window.location.href = "/";
    },
    error: function (error) {
      console.error("Logout failed:", error);
    },
  });
}

function generateCaptcha(canvas, context) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captchaText = "";
  for (let i = 0; i < 6; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "25px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  context.strokeText(captchaText, centerX, centerY);
  return captchaText;
}

// Update the CAPTCHA text variable when generating a new CAPTCHA
refreshLoginCaptchaButton.addEventListener("click", function () {
  loginCaptchaText = generateCaptcha(loginCaptchaCanvas, loginCaptchaContext);
});

// Update the CAPTCHA text variable when generating a new CAPTCHA
refreshForgotCaptchaButton.addEventListener("click", function () {
  forgotCaptchaText = generateCaptcha(forgotCaptchaCanvas, forgotCaptchaContext);
});
// Function to show a Bootstrap modal and redirect after it is hidden
function showModalAndRedirect(modalId, redirectUrl) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
  document
    .getElementById(modalId)
    .addEventListener("hidden.bs.modal", function () {
      window.location.href = redirectUrl;
    });
}

// Function to show a Bootstrap modal
function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}
