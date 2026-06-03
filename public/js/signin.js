const signinForm = document.getElementById("signinForm");
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

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);

    signinForm.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
};


if (signinForm) {
  signinForm.addEventListener("submit", handleSignup);
}
