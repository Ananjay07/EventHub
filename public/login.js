// Show signup form
function showSignup() {
  document.querySelector('.login').classList.add('hidden');
  document.querySelector('.signup').classList.remove('hidden');
  if (window.observeScrollAnimations) window.observeScrollAnimations();
}

// Show login form
function showLogin() {
  document.querySelector('.signup').classList.add('hidden');
  document.querySelector('.login').classList.remove('hidden');
  if (window.observeScrollAnimations) window.observeScrollAnimations();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
      alert('Login successful!');
      window.location.href = 'attendee.html';
    } else {
      alert(data.message || 'Login failed.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred, please try again.');
  }
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Succesfully registered!"); // Display success message
      window.location.href = 'login.html';
    } else {
      alert("Error"); // Show error message
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred, please try again.');
  }
});
