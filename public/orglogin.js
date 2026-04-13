function showSignup() {
    document.querySelector('.login').classList.add('hidden');
    document.querySelector('.signup').classList.remove('hidden');
    if (window.observeScrollAnimations) window.observeScrollAnimations();
}

function showLogin() {
    document.querySelector('.signup').classList.add('hidden');
    document.querySelector('.login').classList.remove('hidden');
    if (window.observeScrollAnimations) window.observeScrollAnimations();
}

// Optional: Add event listeners to handle form submission
document.getElementById('organizerLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('organizerLoginEmail').value;
    const password = document.getElementById('organizerLoginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/organizer/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('organizerName', data.name);
            alert('Login successful!');
            window.location.href = 'orgdashboard.html';
          } else {
            alert(data.message || 'Login failed.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred, please try again.');
        }
      });

// Optional: Add similar event listener for organizer signup
document.getElementById('organizerSignupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('organizerSignupName').value;
    const email = document.getElementById('organizerSignupEmail').value;
    const password = document.getElementById('organizerSignupPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/organizer/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            alert("Successfully registered!");
            window.location.href = 'orglogin.html';
        } else {
            alert(data.message);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again.');
    }
});
