const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O\'quvchi ismi majburiy'],
    trim: true
  },
  
  email: String,
  
  telegramId: Number,
  
  // Teacher reference
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Chess info
  chessComId: String,
  
  lichessId: String,
  
  currentRating: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Rating history
  ratingHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    rating: Number
  }],
  
  // Performance data (%)
  weakAreas: {
    tactics: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    openings: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    endgame: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    timeManagement: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    blunders: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Progress history
  progressHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    rating: Number,
    weakAreas: Object
  }],
  
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
studentSchema.index({ teacherId: 1 });
studentSchema.index({ telegramId: 1 });

module.exports = mongoose.model('Student', studentSchema);
