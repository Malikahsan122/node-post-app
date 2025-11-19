let form = document.getElementById("signupForm");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;

    document.getElementById("usernameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("cpasswordError").textContent = "";

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

    if (!password) {
      document.getElementById("passwordError").textContent =
        "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      document.getElementById("passwordError").textContent =
        "Password must be at least 6 characters";
      isValid = false;
    }

    if (!cpassword) {
      document.getElementById("cpasswordError").textContent =
        "Confirm password is required";
      isValid = false;
    } else if (password !== cpassword) {
      document.getElementById("cpasswordError").textContent =
        "Passwords do not match";
      isValid = false;
    }

    if (!isValid) return;

    let response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    let data = await response.json();
    if (data.success) {
      alert(data.message);
      window.location.href = "/login";
    }
    if (!response.ok) {
      document.getElementById("emailError").textContent = data.error;
    }
  });
}
let loginForm = document.getElementById("loginform");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let isValid = true;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("errormessage").textContent = "";

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
    if (!password) {
      document.getElementById("passwordError").textContent =
        "Password is required";
      isValid = false;
    }

    if (!isValid) return;

    let response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data = await response.json();
    if (data.success) {
      alert(data.message);
      window.location.href = "/profile";
    }
    if (!response.ok) {
      document.getElementById("errormessage").textContent = data.error;
    }
  });
}

let postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let content = document.getElementById("content").value;
    let editing = document.getElementById("editing").value === "true";
    let editId = document.getElementById("editId").value;
    let url = editing ? `/edit/${editId}` : "/profile";
    let method = editing ? "PUT" : "POST";
    let response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    let data = await response.json();
    if (data.success) {
      alert(data.message);
      window.location.href = "/profile";
    }
  });
}
