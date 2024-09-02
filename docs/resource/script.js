$(document).ready(function () {
  // Cache DataTable instance
  var table = $("#myDataTable").DataTable();

  // Initialize tabs
  initTabs("#myTab", table);
  initTabs("#myTab2", table);
  initTabs("#myTab3", table);
  initTabs(".child-tab", table);

  // Set up tab click events
  setTabClickEvents("#home-tab, #deliver-tab, #payment-tab", clearSearch);
  setTabClickEvents("#child1-tab", () => columnSearch(2, ""));
  setTabClickEvents("#child2-tab", () => columnSearch(2, "delivered"));
  setTabClickEvents("#child3-tab", () => columnSearch(2, "pending"));
  setTabClickEvents("#deliverchild4-tab", () => columnSearch(2, "canceled"));
  setTabClickEvents("#child5-tab", () => columnSearch(2, "on process"));
  setTabClickEvents("#paymentchild1-tab", () => columnSearch(3, ""));
  setTabClickEvents("#paymentchild2-tab", () => columnSearch(3, "paymented"));
  setTabClickEvents("#paymentchild3-tab", () => columnSearch(3, "pending"));
  setTabClickEvents("#paymentchild4-tab", () => columnSearch(3, "canceled"));
  setTabClickEvents("#paymentchild5-tab", () => columnSearch(3, "on process"));

  // Dark mode toggle
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    loadToggleSetting();
    checkbox.addEventListener("change", function () {
      $("body, canvas, form-text").toggleClass("dark");
      saveToggleSetting();
    });
  }

  // Remember me functionality
  const rememberMeCheckbox = document.getElementById("rememberMe");
  if (rememberMeCheckbox) {
    loadCredentials();
    rememberMeCheckbox.addEventListener("change", saveOrRemoveCredentials);
  }

  // Handle page load from cache
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) window.location.reload();
  });

  // Initialize CAPTCHA for login form
  initializeCaptcha("loginCaptchaCanvas", "refreshLoginCaptcha", "login-form");

  // Initialize CAPTCHA for forgot password form
  initializeCaptcha("forgotCaptchaCanvas", "refreshForgotCaptcha", "forgot-form");

  // Event listener for logout button
  $("#logoutBtn").click(handleLogout);
});

// Function to initialize CAPTCHA
function initializeCaptcha(canvasId, refreshButtonId, formId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let captchaText = generateCaptcha(canvas, context);

  const refreshButton = document.getElementById(refreshButtonId);
  if (refreshButton) {
    refreshButton.addEventListener("click", () => {
      captchaText = generateCaptcha(canvas, context);
    });
  }

  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      window[`${canvasId}Text`] = captchaText; // Expose CAPTCHA text globally
      handleLoginFormSubmit(new FormData(this));
    });
  }
}

// Function to handle login form submission
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

// Function to initialize tabs
function initTabs(tabSelector, table) {
  $(tabSelector + " a").on("click", function (e) {
    e.preventDefault();
    $(this).tab("show").siblings().removeClass("active").end().addClass("active");

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
    type: "POST",
    success: function (response) {
      console.log("Logout successful:", response);
      window.location.href = "/login"; // Redirect to the login page
    },
    error: function (xhr) {
      console.error("Logout failed:", xhr); // Log the entire XHR object for debugging
      alert("Logout failed. Please try again.");
    },
  });
}

// Function to generate CAPTCHA
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

// Function to show a Bootstrap modal and redirect after it is hidden
function showModalAndRedirect(modalId, redirectUrl) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
  document.getElementById(modalId).addEventListener("hidden.bs.modal", function () {
    window.location.href = redirectUrl;
  });
}

// Function to show a Bootstrap modal
function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}
