const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const forgotPasswordForm = document.getElementById("forgot-password-form");
const sendResetMail = document.getElementById("send-reset-mail");

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const response = await axios.post("/api/users/login", credentials);

    message.textContent = response.data.message;
    message.className = "success";

    localStorage.setItem("token", response.data.token);

    window.location.href = "/";

    message.textContent = "";

    loginForm.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
};

const handleForgotPassword = async () => {
  try {
    const email = document.getElementById("forgot-email").value;

    const response = await axios.post("/api/password/forgotpassword", {
      email,
    });

    console.log(response.data);

    alert(response.data.message);
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to send email");
  }
};

if (sendResetMail) {
  sendResetMail.addEventListener("click", handleForgotPassword);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
