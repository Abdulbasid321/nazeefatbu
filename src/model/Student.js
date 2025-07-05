// const mongoose = require("mongoose");

// const studentSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     regNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     semester: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// studentSchema.statics.login = async function (email, regNumber) {
//     const student = await this.findOne({ email });

//     if (student) {
//         if (regNumber === student.regNumber) { // Plain text comparison
//             return student;
//         }
//         throw Error('Incorrect password');
//     }
//     throw Error('Incorrect email');
// };


// module.exports = mongoose.model("Student", studentSchema);

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    regNumber: {
      type: String,
      required: [true, "Please provide the registration number"],
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional login method using email and regNumber
studentSchema.statics.login = async function (email, regNumber) {
  const student = await this.findOne({ email });

  if (!student) {
    throw Error("Incorrect email");
  }

  if (student.regNumber !== regNumber) {
    throw Error("Incorrect registration number");
  }

  return student;
};

module.exports = mongoose.model("Student", studentSchema);
