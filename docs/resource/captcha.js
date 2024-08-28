document.addEventListener("DOMContentLoaded", function () {
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

  // Initialize CAPTCHA for login form
  const loginCaptchaCanvas = document.getElementById("loginCaptchaCanvas");
  const loginCaptchaContext = loginCaptchaCanvas.getContext("2d");
  const loginCaptchaInput = document.getElementById("loginCaptchaInput");
  const refreshLoginCaptchaButton = document.getElementById("refreshLoginCaptcha");

  let loginCaptchaText = generateCaptcha(loginCaptchaCanvas, loginCaptchaContext);

  // Initialize CAPTCHA for forgot password form
  const forgotCaptchaCanvas = document.getElementById("forgotCaptchaCanvas");
  const forgotCaptchaContext = forgotCaptchaCanvas.getContext("2d");
  const forgotCaptchaInput = document.getElementById("forgotCaptchaInput");
  const refreshForgotCaptchaButton = document.getElementById("refreshForgotCaptcha");

  let forgotCaptchaText = generateCaptcha(forgotCaptchaCanvas, forgotCaptchaContext);

  // Event listener for login form submission
  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    window.loginCaptchaText = loginCaptchaText; // Make CAPTCHA text accessible to login.js
  });

  // Event listener for refresh CAPTCHA button in login form
  refreshLoginCaptchaButton.addEventListener("click", function () {
    loginCaptchaText = generateCaptcha(loginCaptchaCanvas, loginCaptchaContext);
  });

  // Event listener for forgot password form submission
  document.getElementById("forgot-form").addEventListener("submit", function (event) {
    event.preventDefault();
    window.forgotCaptchaText = forgotCaptchaText; // Make CAPTCHA text accessible to login.js
  });

  // Event listener for refresh CAPTCHA button in forgot password form
  refreshForgotCaptchaButton.addEventListener("click", function () {
    forgotCaptchaText = generateCaptcha(forgotCaptchaCanvas, forgotCaptchaContext);
  });

  // Generate CAPTCHA on page load for both forms
  loginCaptchaText = generateCaptcha(loginCaptchaCanvas, loginCaptchaContext);
  forgotCaptchaText = generateCaptcha(forgotCaptchaCanvas, forgotCaptchaContext);
});
