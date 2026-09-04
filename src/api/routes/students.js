const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// O'quvchi routes
router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.get('/:id/profile', studentController.getStudentProfile);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/:id/progress', studentController.getProgress);
router.post('/:id/rate', studentController.updateRating);

module.exports = router;
