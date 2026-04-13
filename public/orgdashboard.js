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

    events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('event-card');
      card.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Type:</strong> ${event.category}</p>
        <p><strong>Coordinator:</strong> ${event.coordinatorName}</p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
            <p><strong>Registered Students:</strong> ${event.rsvpCount || 0}</p>
            <button class="secondary-btn btn-small" style="width: 100%; margin-top: 10px;" onclick="viewRsvps('${event._id}')">View Students</button>
        </div>
      `;
      eventsGrid.appendChild(card);
    });

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
