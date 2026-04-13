const express = require('express');
const router = express.Router();
const Organizer = require('../models/Organizer'); // Ensure this is the correct model for Organizer
const bcrypt = require('bcrypt');

// Organizer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const organizer = await Organizer.findOne({ email });
  if (!organizer) return res.status(404).json({ message: "Organizer not found" });

  if (organizer.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({ message: "Organizer login successful", name: organizer.name });
});

// Organizer signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Organizer.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const newOrg = new Organizer({ name, email, password});
  await newOrg.save();

  res.status(201).json({ message: "Organizer registered successfully" });
});

module.exports = router;
