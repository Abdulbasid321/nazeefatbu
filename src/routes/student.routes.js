const express = require('express');
const router = express.Router();
const Student = require('../model/Student');
const studentController = require('../controller/student.controller');


router.get('/count', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new student
router.post('/create', studentController.createStudent);

// Get all students (optional filter by department or level)
router.get('/all', studentController.getAllStudents);

// studentRoutes.js or wherever you define routes
router.get('/:id', studentController.getStudentById);


// Promote a student to the next level
router.post('/promote/:studentId', studentController.promoteStudent);

// Get all departments
router.get('/departments', studentController.getAllDepartments);

// Get students by department
router.get('/department/:departmentId', studentController.getStudentsByDepartment);


// Student login route
router.post('/login', studentController.studentLogin);

module.exports = router;
