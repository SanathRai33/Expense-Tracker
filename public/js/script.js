const signinForm = document.getElementById("signinForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const response = await axios.post("/api/users/signup", user);

    message.textContent = response.data.message;
    message.className = "success";

    console.log("User signed up:", response.data.user);

    signinForm.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
};

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

    console.log("User logged in:", response.data.user);

    loginForm.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
};

if (signinForm) {
  signinForm.addEventListener("submit", handleSignup);
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
