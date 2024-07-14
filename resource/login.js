document.addEventListener("DOMContentLoaded", function () {
  const captchaCanvas = document.getElementById("captchaCanvas");
  const captchaContext = captchaCanvas.getContext("2d");
  const captchaInput = document.getElementById("captchaInput");
  const captchaError = document.getElementById("captchaError");
  const refreshCaptchaButton = document.getElementById("refreshCaptcha");
  const loginForm = document.getElementById("login-form");

  let captchaText = "";

  function generateCaptcha() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      captchaText = "";
      for (let i = 0; i < 6; i++) {
          captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      captchaContext.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
      captchaContext.font = "25px Arial";
      captchaContext.textAlign = "center";
      captchaContext.textBaseline = "middle";
      const centerX = captchaCanvas.width / 2;
      const centerY = captchaCanvas.height / 2;
      captchaContext.strokeText(captchaText, centerX, centerY);
  }

  refreshCaptchaButton.addEventListener("click", generateCaptcha);
  generateCaptcha();

  loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (captchaInput.value !== captchaText) {
          captchaError.style.display = "block";
          captchaInput.value = "";
          generateCaptcha();
          return;
      }

      captchaError.style.display = "none";
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      if (username === "user" && password === "123") {
          console.log("Login successful");

          const successModal = new bootstrap.Modal(
              document.getElementById("login_success"),
              {
                  keyboard: true,
              }
          );

          successModal.show();

          successModal._element.addEventListener('hidden.bs.modal', function (event) {
              window.location.href = "main.html";
          });
      } else {
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