document.addEventListener("DOMContentLoaded", function() {
  const signupBtn = document.getElementById("signupBtn");
  signupBtn.addEventListener("click", signup);
});

function signup() {
  console.log("Signup function triggered.");
  
  // Retrieve form values
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Confirm Password:", confirmPassword);

  // Validation
  if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
  }

  if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
  }

  // Check if username exists
  if (localStorage.getItem("user_" + username)) {
      alert("Username already exists. Please choose another.");
      return;
  }

  // Store the password directly (no encryption for now)
  const userData = {
      password: password, // No encryption here
      gradeData: {}
  };

  // Save the user data in localStorage (without encryption)
  localStorage.setItem("user_" + username, JSON.stringify(userData));

  // Log the user in automatically after signup
  localStorage.setItem("currentUser", username);
  alert("Signup successful! You are now logged in.");

  // Redirect to the main page
  window.location.href = "index.html";
}
