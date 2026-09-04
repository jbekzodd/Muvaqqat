const Homework = require('../../models/Homework');
const Student = require('../../models/Student');
const { Markup } = require('telegraf');
const logger = require('../../utils/logger');
const { formatDate } = require('../../utils/helpers');

const homeworkHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    // Telegramga asosan o'quvchini topish kerak
    // Hozircha umumiy vazifalar ko'rsatadi
    const homework = await Homework.find({
      status: { $ne: 'completed' }
    })
    .sort({ dueDate: 1 })
    .limit(10)
    .populate('studentId', 'name');
    
    if (homework.length === 0) {
      return ctx.reply('✅ Hech qanday vazifa yo\'q!', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('◀️ Orqaga', 'btn_back')]
        ])
      });
    }
    
    let text = `📝 *UY VAZIFALAR*\n\n`;
    homework.forEach((hw, i) => {
      const dueDate = formatDate(hw.dueDate);
      const statusEmoji = {
        'assigned': '📌',
        'in_progress': '⏳',
        'completed': '✅',
        'overdue': '🔴'
      }[hw.status] || '❓';
      
      text += `${i + 1}. ${statusEmoji} *${hw.title}*\n`;
      text += `   O'quvchi: ${hw.studentId.name}\n`;
      text += `   Turi: ${hw.type}\n`;
      text += `   Muddat: ${dueDate}\n`;
      text += `   Vazifalar: ${hw.tasks.length} ta\n\n`;
    });
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Orqaga', 'btn_back')]
      ])
    });
  } catch (error) {
    logger.error(`Homework handler xatosi: ${error.message}`);
    ctx.reply('❌ Vazifalar yuklanishida xatolik');
  }
};

module.exports = homeworkHandler;
