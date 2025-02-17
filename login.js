function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  
  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }
  
  const userData = localStorage.getItem("user_" + username);
  if (!userData) {
    alert("User not found. Please sign up.");
    return;
  }
  
  let parsedData;
  try {
    parsedData = JSON.parse(userData);
  } catch (e) {
    alert("Error reading user data.");
    return;
  }
  
  if (parsedData.password !== password) {
    alert("Incorrect password.");
    return;
  }
  
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}
