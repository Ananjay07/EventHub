const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('node:dns');

// Force Node.js to use Google DNS, which bypasses the iPhone Hotspot DNS bug!
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import the auth routes (login/signup)
const authRoutes = require('./routes/userAuth'); // User routes
const organizerRoutes = require('./routes/organizerAuth'); // Organizer routes

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json
app.use(express.static('public')); // Serve frontend files

// MongoDB connection
mongoose.connect('mongodb+srv://ananjay1357_db_user:ananju2005@eventhub.jknogi5.mongodb.net/?appName=EventHub', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use the auth routes for user login/signup under /api/auth
app.use('/api/auth', authRoutes); // User routes should be under /api/auth

// Use the organizer routes under /api/organizer
app.use('/api/organizer', organizerRoutes); // Organizer routes should be under /api/organizer

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

const rsvpRoutes = require('./routes/rsvpRoutes');
app.use('/api/rsvp', rsvpRoutes);

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});