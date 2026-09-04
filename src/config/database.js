const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/movaqqat';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.success(`MongoDB ulandi: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Database xatosi: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.success('MongoDB uzildi');
  } catch (error) {
    logger.error(`Disconnect xatosi: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
