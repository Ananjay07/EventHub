let allEvents = [];

async function fetchEvents() {
  try {
    const userEmail = localStorage.getItem('userEmail');
    let userRsvps = [];
    
    // Fetch user RSVPs if logged in
    if (userEmail) {
      const rsvpRes = await fetch('http://localhost:5000/api/rsvp/user/' + encodeURIComponent(userEmail));
      if (rsvpRes.ok) {
        userRsvps = await rsvpRes.json();
      }
    }
    
    // Store array of event IDs the user has registered for
    const rsvpEventIds = userRsvps.map(r => r.eventId);

    const res = await fetch('http://localhost:5000/api/events');
    const events = await res.json();
    allEvents = events; // cache globally for details viewing

    const container = document.getElementById('eventContainer');
    container.innerHTML = ''; 

    if (events.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No events available at the moment.</p>';
      return;
    }

    events.forEach((event, index) => {
      const isRegistered = rsvpEventIds.includes(event._id);
      
      const card = document.createElement('div');
      card.classList.add('event-card', 'animate-on-scroll');
      card.style.transitionDelay = `${(index % 3) * 0.1}s`; // Stagger effect
      
      card.innerHTML = `
        <div class="event-image" style="background-image: linear-gradient(135deg, ${getRandomGradient()});"></div>
        <div class="event-details">
            <span class="event-date">${new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <h3>${event.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Venue:</strong> ${event.venue}</p>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;"><strong>Category:</strong> ${event.category}</p>
            <div style="display: flex; gap: 0.75rem;">
                <button class="secondary-btn" style="flex: 1; padding: 0.5rem;" onclick="openDetailsModal('${event._id}')">Details</button>
                ${isRegistered ? 
                  `<button class="secondary-btn" style="flex: 1; padding: 0.5rem; border-color: #d9534f; color: #d9534f;" onclick="deregister('${event._id}')">De-register</button>` : 
                  `<button class="primary-btn" style="flex: 1; padding: 0.5rem;" onclick="openRSVPModal('${event._id}')">RSVP</button>`
                }
            </div>
        </div>
      `;
      
      container.appendChild(card);
    });

    // Handle animations for new elements
    if (window.observeScrollAnimations) {
        window.observeScrollAnimations();
    }
  } catch (err) {
    console.error('Error fetching events:', err);
  }
}

function getRandomGradient() {
    const gradients = [
        '#a88be8 0%, #7f56d9 100%',
        '#f7ce68 0%, #fbab7e 100%',
        '#84fab0 0%, #8fd3f4 100%',
        '#fa709a 0%, #fee140 100%',
        '#6a11cb 0%, #2575fc 100%'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Display Event Details Modal
function openDetailsModal(eventId) {
    const event = allEvents.find(e => e._id === eventId);
    if (!event) return;

    document.getElementById('detailTitle').innerText = event.title;
    document.getElementById('detailDate').innerText = new Date(event.date).toLocaleDateString();
    document.getElementById('detailVenue').innerText = event.venue;
    document.getElementById('detailCategory').innerText = event.category;
    document.getElementById('detailCoordinator').innerText = event.coordinatorName + " (" + event.coordinatorEmail + ")";
    document.getElementById('detailDescription').innerText = event.description;

    document.getElementById('eventDetailsModal').classList.add('show');
}

function closeDetailsModal() {
    document.getElementById('eventDetailsModal').classList.remove('show');
}

// RSVP Modal Logic
function openRSVPModal(eventId) {
  const modal = document.getElementById('rsvpModal');
  modal.classList.add('show');
  document.getElementById('eventId').value = eventId;
  
  // Pre-fill email and name if available
  const savedName = localStorage.getItem('userName');
  const savedEmail = localStorage.getItem('userEmail');
  if (savedName) document.getElementById('userName').value = savedName;
  if (savedEmail) document.getElementById('userEmail').value = savedEmail;
}

function closeRSVPModal() {
  document.getElementById('rsvpModal').classList.remove('show');
}

// Submit RSVP
async function submitRSVP(event) {
  event.preventDefault();

  const eventId = document.getElementById('eventId').value;
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const phone = document.getElementById('userMobile').value;

  if (!name || !email || !phone) {
    alert('Please fill all the fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, name, email, phone })
    });

    const data = await response.json();
    alert(data.message || 'RSVP successful!');
    
    // Critical fix: Store email locally immediately so fetchEvents updates buttons correctly
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);

    closeRSVPModal();
    fetchEvents(); // refresh grid to show deregister btn
  } catch (err) {
    console.error(err);
    alert('Failed to RSVP.');
  }
}

// Deregister Logic
async function deregister(eventId) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert("You must be logged in with a valid email to de-register.");
        return;
    }

    const confirmCancel = confirm("⚠️ Are you sure you want to cancel your registration for this event?");
    if (!confirmCancel) return;

    try {
        const response = await fetch('http://localhost:5000/api/rsvp/' + eventId + '/' + encodeURIComponent(userEmail), {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Successfully de-registered!");
            fetchEvents(); // refresh the event grid
        } else {
            alert("Failed to de-register. Please try again.");
        }
    } catch (err) {
        console.error("Error deregistering:", err);
        alert("An error occurred.");
    }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

window.onload = fetchEvents;
