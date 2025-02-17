function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  if (!username || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }
  
  // Check if user already exists
  if (localStorage.getItem("user_" + username)) {
    alert("Username already exists. Please choose another.");
    return;
  }
  
  // Create new user data. gradeData starts as an empty object.
  const userData = {
    password: password,
    gradeData: {}
  };
  
  localStorage.setItem("user_" + username, JSON.stringify(userData));
  
  // Automatically log the user in after signup
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}
