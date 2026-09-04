const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  // Student reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Lesson reference (optional)
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  
  // Homework info
  title: {
    type: String,
    required: [true, 'Vazifa nomi majburiy'],
    trim: true
  },
  
  description: String,
  
  type: {
    type: String,
    enum: ['tactics', 'endgame', 'analysis', 'opening', 'other'],
    default: 'tactics'
  },
  
  // Tasks
  tasks: [{
    taskId: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    result: {
      type: String,
      enum: ['solved', 'failed', 'pending', 'skipped'],
      default: 'pending'
    },
    timeSpent: Number, // minutes
    feedback: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed', 'overdue'],
    default: 'assigned'
  },
  
  // Dates
  dueDate: {
    type: Date,
    required: true
  },
  
  completedDate: Date,
  
  // Scoring
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  
  feedback: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
homeworkSchema.index({ studentId: 1 });
homeworkSchema.index({ dueDate: 1 });
homeworkSchema.index({ status: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);
