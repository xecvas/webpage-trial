document.addEventListener("DOMContentLoaded", function () {
  const captchaCanvas = document.getElementById("captchaCanvas");
  const captchaContext = captchaCanvas.getContext("2d");
  const captchaInput = document.getElementById("captchaInput");
  const captchaError = document.getElementById("captchaError");
  const refreshCaptchaButton = document.getElementById("refreshCaptcha");
  
  let captchaText = "";

  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaContext.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
    captchaContext.font = "25px Arial";
    captchaContext.textAlign = "center"; // Center text horizontally
    captchaContext.textBaseline = "middle"; // Center text vertically
    const centerX = captchaCanvas.width / 2;
    const centerY = captchaCanvas.height / 2;
    captchaContext.strokeText(captchaText, centerX, centerY);
  }

  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (captchaInput.value === captchaText) {
      alert("CAPTCHA verified successfully!");
      captchaError.style.display = "none";
      captchaInput.value = "";
      generateCaptcha(); // Generate a new CAPTCHA after successful verification
    } else {
      captchaError.style.display = "block";
      captchaInput.value = "";
      generateCaptcha();
    }
  });

  refreshCaptchaButton.addEventListener("click", function () {
    generateCaptcha();
  });

  // Generate CAPTCHA on page load
  generateCaptcha();
});
