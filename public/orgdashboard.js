// Function to show the event form modal
function openEventForm() {
  document.getElementById('eventFormModal').classList.add('show');
}

// Function to close the event form modal
function closeEventForm() {
  document.getElementById('eventFormModal').classList.remove('show');
}


document.getElementById('addEventForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const venue = document.getElementById('eventVenue').value;
  const category = document.getElementById('eventCategory').value;
  const description = document.getElementById('eventDescription').value;
  const coordinatorName = document.getElementById('coordinatorName').value;
  const coordinatorEmail = document.getElementById('coordinatorEmail').value;

  console.log("Form Data Submitted:", {
    title,
    date,
    venue,
    category,
    description,
    coordinatorName,
    coordinatorEmail
  });

  try {
    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        date,
        venue,
        category,
        description,
        coordinatorName,
        coordinatorEmail
      }),
    });

    const data = await response.json();
    console.log('Response from backend:', data);

    if (response.ok) {
      alert(data.message);
      closeEventForm(); // Close the modal after submission
      fetchEvents(); // Fetch the updated event list
    } else {
      alert(data.message || 'Something went wrong');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error submitting event');
  }
});

// Function to fetch and display events
async function fetchEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();

    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = ''; // Clear previous events

    events.forEach((event, index) => {
      const card = document.createElement('div');
      card.classList.add('event-card', 'animate-on-scroll');
      card.style.transitionDelay = `${(index % 3) * 0.1}s`;
      
      card.innerHTML = `
        <div class="event-details">
            <span class="event-date">${new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <h3>${event.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Venue:</strong> ${event.venue}</p>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;"><strong>Category:</strong> ${event.category}</p>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;"><strong>Coordinator:</strong> ${event.coordinatorName}</p>
            
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                   <span style="font-size: 0.75rem; color: var(--text-muted); display: block; text-transform: uppercase; letter-spacing: 0.5px;">Registered</span>
                   <span style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${event.rsvpCount || 0}</span>
                </div>
                <button class="secondary-btn" style="padding: 0.5rem 1rem;" onclick="viewRsvps('${event._id}')">View List</button>
            </div>
        </div>
      `;
      eventsGrid.appendChild(card);
    });

    // Handle animations for new elements
    if (window.observeScrollAnimations) {
        window.observeScrollAnimations();
    }

  } catch (err) {
    console.error('Error fetching events:', err);
  }
}

// RSVP Modal Logic
async function viewRsvps(eventId) {
    const modal = document.getElementById('rsvpTableModal');
    const tableBody = document.getElementById('studentsTableBody');
    const noStudentsMsg = document.getElementById('noStudentsMsg');
    const table = document.getElementById('studentsTable');

    tableBody.innerHTML = ''; // Clear table
    table.style.display = 'none';
    noStudentsMsg.style.display = 'none';
    modal.classList.add('show');

    try {
        const response = await fetch('http://localhost:5000/api/rsvp/' + eventId);
        const rsvps = await response.json();

        if (rsvps.length > 0) {
            table.style.display = 'table';
            rsvps.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            noStudentsMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        noStudentsMsg.style.display = 'block';
        noStudentsMsg.innerHTML = 'Error loading students.';
    }
}

function closeRsvpTable() {
    document.getElementById('rsvpTableModal').classList.remove('show');
}

function logout() {
    localStorage.removeItem('organizerName');
    window.location.href = 'index.html';
}

window.onload = () => {
    const name = localStorage.getItem('organizerName');
    if (name) {
        document.getElementById('welcomeMsg').innerHTML = 'Welcome, ' + name + '!';
    }
    fetchEvents();
};
