const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
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

    form.reset();
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Something went wrong";

    message.className = "error";
  }
});