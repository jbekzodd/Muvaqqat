const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // Lesson reference
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  
  // Student reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Attendance status
  isPresent: {
    type: Boolean,
    default: false
  },
  
  // Timing
  arrivalTime: Date,
  
  departureTime: Date,
  
  // Additional info
  notes: String,
  
  // Teacher feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  feedback: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
attendanceSchema.index({ lessonId: 1 });
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ isPresent: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
