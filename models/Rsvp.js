const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: String,
  email: String,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rsvp', rsvpSchema);
