const Lesson = require('../../models/Lesson');
const { bot } = require('../../bot');
const logger = require('../../utils/logger');
const { formatDateTime } = require('../../utils/helpers');

const sendReminders = async () => {
  try {
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    
    // 1 soat ichida dars bo'lsa reminder yubor
    const lessons = await Lesson.find({
      scheduledTime: { $gte: now, $lte: nextHour },
      status: 'scheduled'
    }).populate('studentIds', 'telegramId name');
    
    if (lessons.length === 0) {
      logger.info('Eslatma yuboradigan dars yo\'q');
      return;
    }
    
    let sentCount = 0;
    
    for (const lesson of lessons) {
      const time = formatDateTime(lesson.scheduledTime);
      const text = `🔔 *DARS ESLATMASI*\n\n` +
        `📚 *${lesson.title}*\n` +
        `👨‍🏫 *Ustoz:* ${lesson.teacherId.name}\n` +
        `⏰ *Vaqti:* ${time}\n` +
        `📝 *Turi:* ${lesson.type}\n` +
        `⏱ *Davomiyligi:* ${lesson.durationMinutes} daqiqa\n\n` +
        `*Tayyor bo\'ling!*`;
      
      for (const student of lesson.studentIds) {
        if (student.telegramId) {
          try {
            await bot.telegram.sendMessage(student.telegramId, text, {
              parse_mode: 'Markdown'
            });
            sentCount++;
            logger.success(`✅ Eslatma yuborildi: ${student.name}`);
          } catch (err) {
            logger.warn(`Telegram yuborish xatosi (${student.name}): ${err.message}`);
          }
        }
      }
    }
    
    logger.info(`✅ ${sentCount} ta eslatma yuborildi`);
  } catch (error) {
    logger.error(`Reminder xatosi: ${error.message}`);
  }
};

module.exports = sendReminders;
