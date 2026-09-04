require('dotenv').config();
const app = require('./src/app');
const { initializeBot } = require('./src/bot');
const { startScheduler } = require('./src/scheduler');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Database ulash
    await connectDB();
    console.log('✅ Database ulandi');

    // Telegram bot ishga tushirish
    await initializeBot();
    console.log('✅ Telegram bot ishga tushdi');

    // Scheduler ishga tushirish
    startScheduler();
    console.log('✅ Scheduler ishga tushdi');

    // Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 MOVAQQAT server ${PORT}-portda faol!`);
    });
  } catch (error) {
    console.error('❌ Server xatosi:', error.message);
    process.exit(1);
  }
}

startServer();

process.once('SIGINT', () => process.exit(0));
process.once('SIGTERM', () => process.exit(0));
