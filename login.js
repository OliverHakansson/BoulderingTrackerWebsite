function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  
  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }
  
  // Retrieve user data from localStorage
  const storedUser = localStorage.getItem("user_" + username);
  if (!storedUser) {
    alert("User not found. Please sign up.");
    return;
  }
  
  const userData = JSON.parse(storedUser);
  if (userData.password !== password) {
    alert("Incorrect password.");
    return;
  }
  
  // Store the current user in localStorage
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}
