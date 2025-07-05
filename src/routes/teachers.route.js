const express = require('express');
const router = express.Router();
const Parent = require('../model/Parent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const parent = new Parent({
      fullName,
      email,
      phone,
    });

    await parent.save();
    res.status(201).json({ message: "Parent created", parent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Teacher login
router.post('/login', async (req, res) => {
  const { email, phone } = req.body;

  try {
    const teacher = await Parent.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    if (teacher.phone !== phone) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    const token = jwt.sign(
      { id: teacher._id },
      process.env.JWT_SECRET || "poiuytrewqasdfghjklmnbvcxz",
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: "Login successful", token, teacher });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});


module.exports = router;

  