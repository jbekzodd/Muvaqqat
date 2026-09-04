const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ismni kiritish majburiy'],
    trim: true,
    minlength: [2, 'Ism kamida 2 ta belgi bo\'lishi kerak']
  },
  
  email: {
    type: String,
    required: [true, 'Email kiritish majburiy'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Togri email kiriting']
  },
  
  phone: {
    type: String,
    match: [/^(\+?998)?[0-9]{9}$/, 'Togri raqam kiriting']
  },
  
  telegramId: Number,
  
  password: {
    type: String,
    required: [true, 'Parol kiritish majburiy'],
    minlength: [6, 'Parol kamida 6 ta belgi bo\'lishi kerak'],
    select: false
  },
  
  // Teacher info
  isTeacher: {
    type: Boolean,
    default: true
  },
  
  isAdmin: {
    type: Boolean,
    default: false
  },
  
  studentCount: {
    type: Number,
    default: 0
  },
  
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  bio: {
    type: String,
    maxlength: 500
  },
  
  chessRating: {
    type: Number,
    default: 0
  },
  
  // Premium
  isPremium: {
    type: Boolean,
    default: false
  },
  
  premiumExpires: Date,
  
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

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
