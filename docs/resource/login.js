document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    
    // Listen for form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        // Send form data to the server
        fetch('/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const loginSuccessModal = new bootstrap.Modal(document.getElementById("loginSuccess"));
                loginSuccessModal.show();
                document.getElementById("loginSuccess").addEventListener('hidden.bs.modal', function () {
                    window.location.href = "/main";
                });
            } else if (data.error === "captcha") {
                const captchaErrorModal = new bootstrap.Modal(document.getElementById("captchaError"));
                captchaErrorModal.show();
            } else {
                const loginFailedModal = new bootstrap.Modal(document.getElementById("loginFailed"));
                loginFailedModal.show();
            }
        });
    });
});
