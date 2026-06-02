const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

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

    window.location.href = "/index";

    message.textContent = "";

    loginForm.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
