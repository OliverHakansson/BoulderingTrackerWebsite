let gradeData = {};

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function loadUserData() {
  const username = getCurrentUser();
  if (!username) return null;
  
  const encryptedUserData = localStorage.getItem("user_" + username);
  if (!encryptedUserData) return null;
  
  const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret-key');
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    alert("Error decrypting user data.");
    return null;
  }
}

function saveUserData(userData) {
  const username = getCurrentUser();
  const encryptedUserData = CryptoJS.AES.encrypt(JSON.stringify(userData), 'secret-key').toString();
  localStorage.setItem("user_" + username, encryptedUserData);
}

function updateGrade() {
  let grade = document.getElementById("gradeSlider").value;
  document.getElementById("selectedGrade").textContent = "V" + grade;
}

function submitGrade() {
  let username = getCurrentUser();
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }
  
  let grade = document.getElementById("gradeSlider").value;
  let userData = loadUserData();
  
  userData.gradeData[grade] = (userData.gradeData[grade] || 0) + 1;
  saveUserData(userData);
  gradeData = userData.gradeData;
  updateStats();
  updateChart();
}

function removeGrade() {
  let username = getCurrentUser();
  if (!username) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }
  
  let grade = document.getElementById("gradeSlider").value;
  let userData = loadUserData();
  
  if (userData.gradeData[grade] && userData.gradeData[grade] > 0) {
    userData.gradeData[grade] -= 1;
    if (userData.gradeData[grade] === 0) {
      delete userData.gradeData[grade];
    }
    saveUserData(userData);
    gradeData = userData.gradeData;
    updateStats();
    updateChart();
  }
}

function updateStats() {
  let allGrades = [];
  Object.keys(gradeData).forEach(grade => {
    for (let i = 0; i < gradeData[grade]; i++) {
      allGrades.push(parseInt(grade));
    }
  });
  
  allGrades.sort((a, b) => b - a);
  let topFiveGrades = allGrades.slice(0, 5);
  let score = topFiveGrades.reduce((sum, grade) => sum + grade, 0);
  document.getElementById("score").textContent = score;
  
  let hardest = allGrades.length > 0 ? allGrades[0] : 0;
  document.getElementById("hardestClimb").textContent = "V" + hardest;
}

function updateChart() {
  let ctx = document.getElementById("gradeChart").getContext("2d");
  if (window.gradeChartInstance) {
    window.gradeChartInstance.destroy();
  }
  window.gradeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(gradeData).map(g => "V" + g),
      datasets: [{
        label: 'Sends',
        data: Object.values(gradeData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      scales: {
        y: {
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.onload = function () {
  const username = getCurrentUser();
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  
  document.getElementById("currentUsername").textContent = username;
  
  let userData = loadUserData();
  if (userData) {
    gradeData = userData.gradeData;
  }
  updateStats();
  updateChart();
}
