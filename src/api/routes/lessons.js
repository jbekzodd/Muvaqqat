const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// Dars routes
router.post('/', lessonController.createLesson);
router.get('/', lessonController.getLessons);
router.get('/:id', lessonController.getLesson);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);
router.post('/:id/complete', lessonController.completeLesson);
router.get('/teacher/:teacherId/upcoming', lessonController.getUpcomingLessons);

module.exports = router;
