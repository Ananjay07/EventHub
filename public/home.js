document.addEventListener('DOMContentLoaded', () => {
    const attendeeEmail = localStorage.getItem('userEmail');
    const attendeeName = localStorage.getItem('userName');
    const organizerName = localStorage.getItem('organizerName');

    const heroTitle = document.getElementById('heroTitle');
    const heroButtons = document.getElementById('heroButtons');
    const navLoginBtn = document.getElementById('navLoginBtn');

    if (attendeeEmail) {
        // User is logged in as Attendee
        if (heroTitle) heroTitle.innerHTML = `Welcome Back, <span>${attendeeName || 'Attendee'}</span>!`;
        if (heroButtons) {
            heroButtons.innerHTML = `
                <a href="attendee.html"><button class="primary-btn">Go to Dashboard</button></a>
                <button class="secondary-btn" onclick="logout()">Logout</button>
            `;
        }
        if (navLoginBtn) {
            navLoginBtn.outerHTML = `<button class="login-btn" onclick="logout()">Logout</button>`;
        }
    } else if (organizerName) {
        // User is logged in as Organizer
        if (heroTitle) heroTitle.innerHTML = `Welcome Back, <span>${organizerName}</span>!`;
        if (heroButtons) {
            heroButtons.innerHTML = `
                <a href="orgdashboard.html"><button class="primary-btn">Go to Dashboard</button></a>
                <button class="secondary-btn" onclick="logout()">Logout</button>
            `;
        }
        if (navLoginBtn) {
            navLoginBtn.outerHTML = `<button class="login-btn" onclick="logout()">Logout</button>`;
        }
    }
});

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
