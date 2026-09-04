const Lesson = require('../../models/Lesson');
const { Markup } = require('telegraf');
const logger = require('../../utils/logger');
const { formatDateTime } = require('../../utils/helpers');

const lessonHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    // Kelasi darslar (jadval bo'yicha)
    const now = new Date();
    const lessons = await Lesson.find({
      status: 'scheduled',
      scheduledTime: { $gte: now }
    })
    .sort({ scheduledTime: 1 })
    .limit(5)
    .populate('teacherId', 'name')
    .populate('studentIds', 'name');
    
    if (lessons.length === 0) {
      return ctx.reply('❌ Hech qanday dars topilmadi', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('◀️ Orqaga', 'btn_back')]
        ])
      });
    }
    
    let text = `📚 *KELASI DARSLAR*\n\n`;
    lessons.forEach((lesson, i) => {
      const time = formatDateTime(lesson.scheduledTime);
      const studentCount = lesson.studentIds.length;
      
      text += `${i + 1}. *${lesson.title}*\n`;
      text += `   👨‍🏫 ${lesson.teacherId.name}\n`;
      text += `   ⏰ ${time}\n`;
      text += `   👥 O'quvchilar: ${studentCount}\n`;
      text += `   📝 ${lesson.type}\n`;
      text += `   ⏱ ${lesson.durationMinutes} daqiqa\n\n`;
    });
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Orqaga', 'btn_back')]
      ])
    });
  } catch (error) {
    logger.error(`Lesson handler xatosi: ${error.message}`);
    ctx.reply('❌ Darslar yuklanishida xatolik');
  }
};

module.exports = lessonHandler;
