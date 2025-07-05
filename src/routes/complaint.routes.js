
// routes/complaints.js or wherever you define routes
const express = require('express');
const router = express.Router();
const Complaint = require('../model/Compliant');

router.post('/', async (req, res) => {
  const { fullName, senderType, message } = req.body;

  try {
    const complaint = new Complaint({ fullName, senderType, message });
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Total complaints
// router.get('/complaints/count', async (req, res) => {
//   try {
//     const count = await Complaint.countDocuments();
//     res.json({ count });
//   } catch {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

//
// GET total complaints
router.get('/count', async (req, res) => {
  try {
    const count = await Complaint.countDocuments();
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET total students
// router.get('/students/count', async (req, res) => {
//   try {
//     const count = await Student.countDocuments();
//     res.json({ count });
//   } catch {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;
