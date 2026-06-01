const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const response = await axios.post("/api/users/signup", user);

  const data = await response.data;

  alert(data.message);

  form.reset();
});