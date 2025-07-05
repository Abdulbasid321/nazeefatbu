// const mongoose = require('mongoose');

// const teacherSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   password: { type: String, required: true },
// //   role: {
// //     type: String,
// //     default: "teacher"
// //   }
// }, { timestamps: true });

// module.exports = mongoose.model('Teacher', teacherSchema);
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
fulltName: String,
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Parent', teacherSchema);
