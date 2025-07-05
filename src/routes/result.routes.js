// const { Router } = require('express');
// const Result = require('../model/Result');
// const upload = require('../middleware/multerConfig');
// const passport = require('../middleware/passport');

// const router = Router();

// router.post('/uploadResult', upload.single('result'), async (req, res) => {
//   try {
//     const { user, classId } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
//     const newResult = new Result({
//         user: user,
//       classId: classId,
//       fileData: file.buffer,
//       fileType: file.mimetype,
//       fileName: file.originalname
//     });     
//     await newResult.save();

//     res.status(201).json({ message: 'Result uploaded successfully', result: newResult });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// router.delete = async (req, res) => {
//   const id = req.params;

//   try {
//       const resultExist = await Result.findById(fileId);
//       if (!resultExist) {
//           return res.status(404).json({ message: "Result doesn't exist" });
//       }

//       await Result.findByIdAndDelete(id);
//       res.status(200).json({ message: "Result deleted successfully" });
//   } catch (err) {
//       const errors = handleErrors(err);
//       res.status(400).json({ errors });
//   }
// };


// // Add a new student result
// router.post("/addResult", async (req, res) => {
//   try {
//     const { regNumber, course, grade } = req.body;
//     if (!regNumber || !course || !grade) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newResult = new Result({ regNumber, course, grade });
//     await newResult.save();
//     res.status(201).json({ message: "Result added successfully", result: newResult });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });



// router.get("/getResults/:regNumber", async (req, res) => {
//   try {
//     const { regNumber } = req.params;
//     console.log("🔍 Received regNumber:", regNumber);

//     const results = await Result.find({ regNumber: { $regex: new RegExp(`^${regNumber}$`, "i") } });
//     console.log("🔍 Query results:", results);

//     if (!results.length) {
//       console.log("⚠️ No results found for:", regNumber);
//       return res.status(200).json({ message: "No results found", results: [] });
//     }

//     res.status(200).json({ message: "Results fetched successfully", results });
//   } catch (error) {
//     console.error("❌ Server error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("../utils/clodinaryConfig");
const Result = require("../model/Result");
const authenticateStudent = require("../middleware/authStudent");

const router = Router();

// Memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Upload Result

router.post("/uploadResult", upload.array("results", 10), async (req, res) => {
  try {
    let regNumbers = req.body.regNumbers;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!regNumbers || regNumbers.length === 0) {
      return res.status(400).json({ error: "regNumbers are required" });
    }

    // Normalize regNumbers to array (handles case when it's a single string)
    if (!Array.isArray(regNumbers)) {
      regNumbers = [regNumbers];
    }

    if (regNumbers.length !== files.length) {
      return res.status(400).json({ error: "regNumbers count must match files count" });
    }

    const uploadedResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const regNumber = regNumbers[i];
      const safeFileName = regNumber.replace(/[^a-zA-Z0-9]/g, "");

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: `student_results/${safeFileName}_${file.originalname}`,
            timeout: 60000,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      });

      const newResult = new Result({
        regNumber,
        fileUrl: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id,
        fileName: file.originalname,
        fileType: file.mimetype,
      });

      await newResult.save();
      uploadedResults.push(newResult);
    }

    res.status(201).json({
      message: "Results uploaded successfully",
      results: uploadedResults,
    });

  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// router.get("/student/results/:regNumber", async (req, res) => {
//   try {
//     const { regNumber } = req.params;

//     if (!regNumber)
//       return res.status(400).json({ error: "Registration number is required" });

//     const result = await Result.find({ regNumber: regNumber.toUpperCase() });

//     if (!result)
//       return res.status(404).json({ message: "No result found for this reg number" });

//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// 📌 Delete Result by ID

router.get("/student/results/:regNumber", async (req, res) => {
  try {
    const { regNumber } = req.params;

    if (!regNumber)
      return res.status(400).json({ error: "Registration number is required" });

    const result = await Result.find({
      regNumber: { $regex: new RegExp(`^${regNumber}$`, "i") },
    });

    if (!result || result.length === 0)
      return res.status(404).json({ message: "No result found for this reg number" });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete("/deleteResult/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(result.publicId, {
      resource_type: "raw",
    });

    // Delete from MongoDB
    await Result.findByIdAndDelete(id);

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;



// module.exports = router;

// const { Router } = require("express");
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");
// const Result = require("../model/Result");

// const router = Router();

// // Use memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post("/uploadResult", upload.single("result"), async (req, res) => {
//   try {
//     const { regNumber } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const uploaded = await cloudinary.uploader.upload_stream(
//       {
//         resource_type: "auto",
//         folder: "student_results",
//       },
//       async (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return res.status(500).json({ error: "Failed to upload to Cloudinary" });
//         }

//         const newResult = new Result({
//           regNumber,
//           fileUrl: result.secure_url,
//           publicId: result.public_id,
//           fileType: file.mimetype,
//           fileName: file.originalname,
//         });

//         await newResult.save();
//         return res.status(201).json({ message: "Result uploaded successfully", result: newResult });
//       }
//     );

//     // Trigger upload
//     uploaded.end(file.buffer);
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/downloadResult/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result || !result.filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.resolve(result.filePath);
    res.download(filePath, result.fileName); // fileName = original name to download
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
