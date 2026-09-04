const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Davomat routes
router.post('/', attendanceController.createAttendance);
router.get('/lesson/:lessonId', attendanceController.getLessonAttendance);
router.get('/student/:studentId', attendanceController.getStudentAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);
router.get('/stats/student/:studentId', attendanceController.getAttendanceStats);

module.exports = router;
