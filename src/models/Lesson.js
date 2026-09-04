const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  // Teacher reference
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Students references
  studentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Lesson info
  title: {
    type: String,
    required: [true, 'Dars nomi majburiy'],
    trim: true
  },
  
  description: String,
  
  // Timing
  scheduledTime: {
    type: Date,
    required: [true, 'Dars vaqti majburiy']
  },
  
  durationMinutes: {
    type: Number,
    default: 60,
    min: 15,
    max: 300
  },
  
  // Lesson type
  type: {
    type: String,
    enum: ['tactic', 'endgame', 'opening', 'general', 'analysis'],
    default: 'general'
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Additional info
  notes: String,
  
  materials: [String], // Links to materials
  
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
lessonSchema.index({ teacherId: 1 });
lessonSchema.index({ scheduledTime: 1 });
lessonSchema.index({ status: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
