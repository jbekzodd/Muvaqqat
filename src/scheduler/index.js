const { registerTask } = require('../config/scheduler');
const sendReminders = require('./tasks/sendReminders');
const updateStats = require('./tasks/updateStats');
const weeklyReport = require('./tasks/weeklyReport');
const checkOverdueHomework = require('./tasks/checkOverdueHomework');
const updateWeakAreas = require('./tasks/updateWeakAreas');
const logger = require('../utils/logger');

const startScheduler = () => {
  try {
    logger.info('Scheduler ishga tushyapti...');
    
    // Har 30 daqiqada eslatma yubor (08:00-23:00)
    registerTask('*/30 8-23 * * *', 'Send Reminders', sendReminders);
    
    // Har kuni 23:00-da statistika yangilash
    registerTask('0 23 * * *', 'Update Stats', updateStats);
    
    // Har juma 18:00-da haftalik hisobot yubor
    registerTask('0 18 * * 5', 'Weekly Report', weeklyReport);
    
    // Har 6 soatda o'tib ketgan vazifalarni tekshir
    registerTask('0 */6 * * *', 'Check Overdue Homework', checkOverdueHomework);
    
    // Har kuni 20:00-da zaif tomonlarni yangilash
    registerTask('0 20 * * *', 'Update Weak Areas', updateWeakAreas);
    
    logger.success('✅ Scheduler ishga tushdi');
  } catch (error) {
    logger.error(`Scheduler xatosi: ${error.message}`);
  }
};

module.exports = { startScheduler };
