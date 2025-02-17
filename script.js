document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("currentUser");
  
    if (!username) {
      window.location.href = "login.html";
      return;
    }
  
    // Display the current user's username
    document.getElementById("currentUsername").textContent = username;
  
    // Bind the slider's input event so that the displayed grade updates in real-time
    const gradeSlider = document.getElementById("gradeSlider");
    gradeSlider.addEventListener("input", updateGrade);
  
    // Load the user's data
    let userData = loadUserData(username);
    console.log("User data loaded:", userData);
  
    // Update stats and chart
    updateStats(userData.gradeData);
    updateChart(userData.gradeData);
  });
  
  // Load user data from localStorage
  function loadUserData(username) {
    const userData = localStorage.getItem("user_" + username);
    return userData ? JSON.parse(userData) : { gradeData: {} };
  }
  
  // Update statistics like score and hardest climb
  function updateStats(gradeData) {
    let allGrades = [];
    Object.keys(gradeData).forEach((grade) => {
      for (let i = 0; i < gradeData[grade]; i++) {
        allGrades.push(parseInt(grade));
      }
    });
  
    allGrades.sort((a, b) => b - a);
    let topFiveGrades = allGrades.slice(0, 5);
    let score = topFiveGrades.reduce((sum, grade) => sum + grade, 0);
  
    document.getElementById("score").textContent = score;
    document.getElementById("hardestClimb").textContent = "V" + (allGrades[0] || 0);
  }
  
  // Update the chart with the latest grade data
  function updateChart(gradeData) {
    const canvas = document.getElementById("gradeChart");
    if (!canvas) {
      console.error("Canvas element with id 'gradeChart' not found.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get context for canvas.");
      return;
    }
  
    // Destroy previous chart instance if it exists
    if (window.gradeChartInstance) {
      window.gradeChartInstance.destroy();
      console.log("Previous chart instance destroyed.");
    }
  
    // Sort the grades numerically so they display in order
    let sortedGrades = Object.keys(gradeData).map(Number).sort((a, b) => a - b);
    let sortedData = sortedGrades.map((grade) => gradeData[grade]);
  
    console.log("Sorted Grades:", sortedGrades);
    console.log("Sorted Data:", sortedData);
  
    // Create the chart (even if empty data)
    window.gradeChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedGrades.map(g => "V" + g),
        datasets: [{
          label: "Sends",
          data: sortedData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 14
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 14
              },
              stepSize: 1
            }
          }
        }
      }
    });
  
    console.log("Chart updated successfully.");
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
  
  // Handle adding a grade
  function submitGrade() {
    const username = localStorage.getItem("currentUser");
    const grade = document.getElementById("gradeSlider").value;
    if (!username || grade === undefined) return;
  
    let userData = loadUserData(username);
    // Ensure gradeData exists
    if (!userData.gradeData) {
      userData.gradeData = {};
    }
    userData.gradeData[grade] = (userData.gradeData[grade] || 0) + 1;
    localStorage.setItem("user_" + username, JSON.stringify(userData));
  
    updateStats(userData.gradeData);
    updateChart(userData.gradeData);
  }
  
  // Handle removing a grade
  function removeGrade() {
    const username = localStorage.getItem("currentUser");
    const grade = document.getElementById("gradeSlider").value;
    if (!username || grade === undefined) return;
  
    let userData = loadUserData(username);
    // Ensure gradeData exists
    if (!userData.gradeData) {
      userData.gradeData = {};
    }
    if (userData.gradeData[grade] && userData.gradeData[grade] > 0) {
      userData.gradeData[grade] -= 1;
      if (userData.gradeData[grade] === 0) {
        delete userData.gradeData[grade];
      }
    }
  
    localStorage.setItem("user_" + username, JSON.stringify(userData));
  
    updateStats(userData.gradeData);
    updateChart(userData.gradeData);
  }
  
  // Update the selected grade display as the slider moves
  function updateGrade() {
    const grade = document.getElementById("gradeSlider").value;
    document.getElementById("selectedGrade").textContent = "V" + grade;
  }
  