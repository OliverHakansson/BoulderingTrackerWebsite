let gradeData = {};

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function loadUserData() {
  const username = getCurrentUser();
  if (!username) return null;
  const storedUser = localStorage.getItem("user_" + username);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

function saveUserData(userData) {
  const username = getCurrentUser();
  localStorage.setItem("user_" + username, JSON.stringify(userData));
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
  
  // Update grade data for the user
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
  
  // Display current username
  document.getElementById("currentUsername").textContent = username;
  
  let userData = loadUserData();
  if (userData) {
    gradeData = userData.gradeData;
  }
  updateStats();
  updateChart();
}
