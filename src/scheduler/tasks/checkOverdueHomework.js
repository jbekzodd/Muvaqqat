const Homework = require('../../models/Homework');
const { bot } = require('../../bot');
const logger = require('../../utils/logger');

const checkOverdueHomework = async () => {
  try {
    const now = new Date();
    
    // O'tib ketgan muddatli vazifalarni topish
    const overdueHomework = await Homework.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    }).populate('studentId', 'name telegramId');
    
    if (overdueHomework.length === 0) {
      logger.info('O\'tib ketgan vazifa yo\'q');
      return;
    }
    
    let notifiedCount = 0;
    
    for (const hw of overdueHomework) {
      try {
        // Statusni "overdue" ga o'zgartirish
        hw.status = 'overdue';
        await hw.save();
        
        // O'quvchiga xabar yubor
        if (hw.studentId.telegramId) {
          const text = `⚠️ *O'TIB KETGAN VAZIFA*\n\n` +
            `📝 *${hw.title}*\n` +
            `🔴 Muddat o'tib ketdi!\n` +
            `👨‍🏫 Ustoz bilan bog'lanib, bekor qilishning sababini ayting.`;
          
          try {
            await bot.telegram.sendMessage(hw.studentId.telegramId, text, {
              parse_mode: 'Markdown'
            });
            notifiedCount++;
          } catch (err) {
            logger.warn(`Xabar yuborish xatosi: ${err.message}`);
          }
        }
        
        logger.success(`✅ O'tib ketgan vazifa belgilandi: ${hw._id}`);
      } catch (error) {
        logger.warn(`Vazifa xatosi: ${error.message}`);
      }
    }
    
    logger.info(`✅ ${notifiedCount} ta o'quvchiga xabar yuborildi`);
  } catch (error) {
    logger.error(`Overdue homework xatosi: ${error.message}`);
  }
};

module.exports = checkOverdueHomework;
