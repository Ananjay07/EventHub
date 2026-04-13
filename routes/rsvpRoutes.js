const express = require('express');
const router = express.Router();
const Rsvp = require('../models/Rsvp');

router.post('/', async (req, res) => {
  const { eventId, name, email, phone } = req.body;

  if (!eventId || !name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newRsvp = new Rsvp({ eventId, name, email, phone });
    await newRsvp.save();
    res.status(201).json({ message: 'RSVP saved successfully' });
  } catch (err) {
    console.error('RSVP save error:', err);
    res.status(500).json({ message: 'Failed to save RSVP' });
  }
});

// GET route to fetch all RSVPs for a specific event
router.get('/:eventId', async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ eventId: req.params.eventId });
    res.status(200).json(rsvps);
  } catch (err) {
    console.error('Error fetching RSVPs:', err);
    res.status(500).json({ message: 'Failed to fetch RSVPs' });
  }
});

// GET route to fetch all RSVPs by a user's email
router.get('/user/:email', async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ email: req.params.email });
    res.status(200).json(rsvps);
  } catch (err) {
    console.error('Error fetching User RSVPs:', err);
    res.status(500).json({ message: 'Failed to fetch User RSVPs' });
  }
});

// DELETE route to de-register from an event
router.delete('/:eventId/:email', async (req, res) => {
  try {
    const { eventId, email } = req.params;
    await Rsvp.deleteOne({ eventId, email });
    res.status(200).json({ message: 'Successfully de-registered!' });
  } catch (err) {
    console.error('Error deleting RSVP:', err);
    res.status(500).json({ message: 'Failed to de-register' });
  }
});

module.exports = router;
