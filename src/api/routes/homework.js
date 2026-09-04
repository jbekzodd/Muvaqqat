const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');

// Uy vazifasi routes
router.post('/', homeworkController.createHomework);
router.get('/', homeworkController.getAllHomework);
router.get('/:id', homeworkController.getHomework);
router.put('/:id', homeworkController.updateHomework);
router.delete('/:id', homeworkController.deleteHomework);
router.get('/student/:studentId', homeworkController.getStudentHomework);
router.post('/:id/complete', homeworkController.completeHomework);
router.post('/:id/submit', homeworkController.submitHomework);
router.get('/stats/student/:studentId', homeworkController.getHomeworkStats);

module.exports = router;
