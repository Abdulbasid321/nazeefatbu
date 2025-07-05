const { Router } = require('express');


const router = Router();
const userController = require('../controllers/user.controller')
const studentController = require('../controllers/student.controller')
router.post('/login', studentController.login)
// router.post('/login', userController.login)
router.post('/admin', userController.adminLogin)



module.exports = router;