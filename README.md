# EventHub 📅

EventHub is a modern, full-stack event management web application that seamlessly connects event organizers with attendees. Built with a focus on clean logic and beautiful UI, EventHub offers specialized, dynamic dashboards for both roles, real-time RSVP tracking, and secure, cached authentication workflows.

![EventHub Banner](https://img.shields.io/badge/EventHub-FullStack-7f56d9.svg?style=for-the-badge)

## 🚀 Features

### For Attendees
* **Browse Events:** View upcoming events in a beautifully organized, responsive CSS-grid layout.
* **Detailed Modals:** Access comprehensive event descriptions and coordinator contacts via clean overlay modals.
* **Smart RSVP System:** Register for events with a single click. The platform dynamically caches your identity so your feed instantly updates to reflect your specific registrations.
* **Seamless De-registration:** Change your mind? Easily cancel your RSVP via the intelligent "De-Register" feature, complete with safety confirmations.

### For Organizers
* **Personalized Dashboard:** A customized hub for organizers to manage the events they have created.
* **Live Registration Analytics:** Every event card prominently displays the exact trackable count of registered students.
* **Secure Attendee Data:** View the full roster of students (Name, Email, Phone) who have RSVP'd to your specific events via a unified data table modal.
* **Event Creation:** Easily spin up Technical, Cultural, Sports, or Exhibition events into the database.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript, DOM Manipulation, Browser LocalStorage API
* **Backend:** Node.js, Express.js, RESTful API Architecture
* **Database:** MongoDB Atlas (NoSQL), Mongoose ORM
* **Version Control & Deployment:** Git, GitHub

## ⚙️ Running Locally

Follow these steps to run the application on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ananjay07/EventHub.git
   ```
2. **Navigate into the project directory:**
   ```bash
   cd EventHub
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Start the Node.js Server:**
   ```bash
   node app.js
   ```
5. **Open your browser** and navigate to `http://localhost:5000` to interact with the platform!

## 📥 API Endpoints

The robust Express server manages the following core REST APIs:
* `POST /api/auth/login` | `POST /api/auth/signup` - Dual-role authentication.
* `GET /api/events` - Main event retrieval and rendering pipeline.
* `POST /api/rsvp` - Register a user for an event dynamically.
* `GET /api/rsvp/user/:email` - Intelligently fetch personal user logs.
* `DELETE /api/rsvp/:eventId/:email` - Securely wipe individual RSVP logs.
