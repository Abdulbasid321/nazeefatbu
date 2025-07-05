const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  senderType: { type: String, enum: ['parent', 'student'], required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);
