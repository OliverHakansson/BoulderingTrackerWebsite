function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  
  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }
  
  const encryptedUserData = localStorage.getItem("user_" + username);
  if (!encryptedUserData) {
    alert("User not found. Please sign up.");
    return;
  }
  
  const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret-key');
  let decryptedData;
  try {
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    alert("Error decrypting user data.");
    return;
  }
  
  const decryptedPassword = CryptoJS.AES.decrypt(decryptedData.password, 'secret-key').toString(CryptoJS.enc.Utf8);
  
  if (decryptedPassword !== password) {
    alert("Incorrect password.");
    return;
  }
  
  localStorage.setItem("currentUser", username);
  window.location.href = "index.html";
}
