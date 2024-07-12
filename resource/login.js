document.addEventListener("DOMContentLoaded", (event) => {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function (event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Get the username and password input values
    const username = document.getElementById("username").value.trim(); // Trim whitespace
    const password = document.getElementById("password").value;

    // Check the username and password
    if (username === "user" && password === "123") {
      console.log("Login successful");
    
      // Show the success modal if login is successful
      const successModal = new bootstrap.Modal(
        document.getElementById("login_success"),
        {
          keyboard: true,
        }
      );
    
      successModal.show();
    
      // Redirect to the main page after showing the success modal
      successModal._element.addEventListener('hidden.bs.modal', function (event) {
        window.location.href = "main.html"; // Replace with your actual main page URL
      });
    } else {
      // Handle login failure (show an error message)
      const failedModal = new bootstrap.Modal(
        document.getElementById("login_failed"),
        {
          keyboard: false,
        }
      );
      failedModal.show();
    }
  });
});
