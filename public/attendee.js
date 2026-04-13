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

    events.forEach(event => {
      const isRegistered = rsvpEventIds.includes(event._id);
      
      const card = document.createElement('div');
      card.classList.add('event-card');
      card.innerHTML = `
        <h3 style="color: #7f56d9; margin-bottom: 10px;">${event.title}</h3>
        <p style="margin-bottom: 5px; color: #444;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p style="margin-bottom: 5px; color: #444;"><strong>Venue:</strong> ${event.venue}</p>
        <p style="margin-bottom: 15px; color: #444;"><strong>Type:</strong> ${event.category}</p>
        <div style="margin-top: auto; border-top: 1px solid #eee; padding-top: 15px; display: flex; gap: 10px;">
            <button class="secondary-btn btn-small" style="flex: 1;" onclick="openDetailsModal('${event._id}')">Details</button>
            ${isRegistered ? 
              `<button class="secondary-btn btn-small" style="flex: 1; border-color: #d9534f; color: #d9534f;" onclick="deregister('${event._id}')">De-register</button>` : 
              `<button class="primary-btn btn-small" style="flex: 1;" onclick="openRSVPModal('${event._id}')">RSVP</button>`
            }
        </div>
      `;
      // Flex styles to push buttons to bottom
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching events:', err);
  }
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
