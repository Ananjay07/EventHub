document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    const data = {
      name: name,
      email: email,
      password: password,
    };
  
    // Sending POST request to the local backend signup endpoint
    fetch('http://localhost:5000/signup', {  // Local backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.success) {
          window.location.href = 'login.html';  // Redirect to login after successful signup
        } else {
          alert(result.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred');
      });
  });
  