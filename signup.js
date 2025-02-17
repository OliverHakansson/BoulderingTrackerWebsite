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
  
  if (localStorage.getItem("user_" + username)) {
    alert("Username already exists. Please choose another.");
    return;
  }
  
  const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();

  const userData = {
    password: encryptedPassword,
    gradeData: {}
  };
  
  const encryptedUserData = CryptoJS.AES.encrypt(JSON.stringify(userData), 'secret-key').toString();
  
  localStorage.setItem("user_" + username, encryptedUserData);
  
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}
