document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginCaptchaInput = document.getElementById("loginCaptchaInput");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Re-generate loginCaptchaText on each form submission
        const loginCaptchaText = window.loginCaptchaText; // Access CAPTCHA text from captcha.js

        if (loginCaptchaInput.value !== loginCaptchaText) {
            // Show CAPTCHA error modal
            const captchaErrorModal = new bootstrap.Modal(document.getElementById("captchaError"));
            captchaErrorModal.show();
            captchaErrorModal.addEventListener('hidden.bs.modal', function () {
                location.reload(); // Refresh page after CAPTCHA error modal is closed
            });
        } else {
            // CAPTCHA is correct, check username and password
            if (username === "user" && password === "123") {
                // Show login success modal
                const loginSuccessModal = new bootstrap.Modal(document.getElementById("loginSuccess"));
                loginSuccessModal.show();
                document.getElementById("loginSuccess").addEventListener('hidden.bs.modal', function () {
                    window.location.href = "main.html";
                });
            } else {
                // Show login failed modal
                const loginFailedModal = new bootstrap.Modal(document.getElementById("loginFailed"));
                loginFailedModal.show();
            }
        }
    });
});
