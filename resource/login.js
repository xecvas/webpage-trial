document.addEventListener("DOMContentLoaded", function () {
    // Get login form and CAPTCHA input elements
    const loginForm = document.getElementById("login-form");
    const loginCaptchaInput = document.getElementById("loginCaptchaInput");

    // Listen for form submission
    loginForm.addEventListener("submit", function (event) {
        // Prevent default form submission behavior
        event.preventDefault();

        // Get username and password values
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Get CAPTCHA text from captcha.js
        const loginCaptchaText = window.loginCaptchaText;

        // Check if CAPTCHA is correct
        if (loginCaptchaInput.value !== loginCaptchaText) {
            // Show CAPTCHA error modal
            const captchaErrorModal = new bootstrap.Modal(document.getElementById("captchaError"));
            captchaErrorModal.show();
            // Refresh page after CAPTCHA error modal is closed
            captchaErrorModal.addEventListener('hidden.bs.modal', function () {
                location.reload();
            });
        } else {
            // Check username and password
            if (username === "user" && password === "123") {
                // Show login success modal
                const loginSuccessModal = new bootstrap.Modal(document.getElementById("loginSuccess"));
                loginSuccessModal.show();
                // Redirect to main.html after login success modal is closed
                document.getElementById("loginSuccess").addEventListener('hidden.bs.modal', function () {
                    window.location.href = "/main";
                });
            } else {
                // Show login failed modal
                const loginFailedModal = new bootstrap.Modal(document.getElementById("loginFailed"));
                loginFailedModal.show();
            }
        }
    });
});