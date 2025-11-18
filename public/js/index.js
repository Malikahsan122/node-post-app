let form = document.getElementById("signupForm");
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // always prevent default first

  let isValid = true;

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;

  // Clear previous errors
  document.getElementById("usernameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("cpasswordError").textContent = "";

  // ===== Username validation =====
  if (!username) {
    document.getElementById("usernameError").textContent =
      "Username is required";
    isValid = false;
  } else if (username.length < 3) {
    document.getElementById("usernameError").textContent =
      "Username must be at least 3 characters";
    isValid = false;
  }

  // ===== Email validation =====
  if (!email) {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email";
      isValid = false;
    }
  }

  // ===== Password validation =====
  if (!password) {
    document.getElementById("passwordError").textContent =
      "Password is required";
    isValid = false;
  } else if (password.length < 6) {
    document.getElementById("passwordError").textContent =
      "Password must be at least 6 characters";
    isValid = false;
  }

  // ===== Confirm Password validation =====
  if (!cpassword) {
    document.getElementById("cpasswordError").textContent =
      "Confirm password is required";
    isValid = false;
  } else if (password !== cpassword) {
    document.getElementById("cpasswordError").textContent =
      "Passwords do not match";
    isValid = false;
  }

  if (!isValid) return; // Stop fetch if invalid

  // ===== Send fetch only if valid =====
  let response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  let data = await response.json();

  if (!response.ok) {
    document.getElementById("emailError").textContent = data.error;
  } else {
    alert(data.message);
  }
});
