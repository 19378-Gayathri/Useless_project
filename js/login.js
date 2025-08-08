// login.js
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Optional: fake validation
    if (username && password) {
      // Save fish name in localStorage (optional)
      localStorage.setItem("fishUser", username);
  
      // Redirect to home page
      window.location.href = "home.html";
    } else {
      alert("Please enter your Fish name and Bubble code.");
    }
  });
  