const Student = require('../../models/Student');
const { Markup } = require('telegraf');
const logger = require('../../utils/logger');

const progressHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    // Masalan: birinchi o'quvchini ko'rsat (real loyihada Telegram ID orqali topish kerak)
    const student = await Student.findOne()
      .select('name currentRating weakAreas ratingHistory progressHistory')
      .populate('teacherId', 'name');
    
    if (!student) {
      return ctx.reply('❌ Profil topilmadi. Iltimos ustoz bilan bog\'lanib urinib ko\'ring.', {
        ...Markup.inlineKeyboard([
          [Markup.button.callback('◀️ Orqaga', 'btn_back')]
        ])
      });
    }
    
    // Reyting o'zgarishi
    let ratingChange = 0;
    let changeText = '➡️ 0';
    
    if (student.ratingHistory.length > 1) {
      const lastRating = student.ratingHistory[student.ratingHistory.length - 1].rating;
      ratingChange = student.currentRating - lastRating;
      if (ratingChange > 0) {
        changeText = `🔺 +${ratingChange}`;
      } else if (ratingChange < 0) {
        changeText = `🔻 ${ratingChange}`;
      }
    }
    
    let text = `📊 *MENING STATISTIKAM*\n\n`;
    text += `*O'quvchi:* ${student.name}\n`;
    text += `*Ustoz:* ${student.teacherId.name}\n\n`;
    text += `⭐ *Reyting:* ${student.currentRating} ${changeText}\n\n`;
    
    text += `*Zaif Tomonlar:*\n`;
    text += `├─ 🎯 Taktika: ${student.weakAreas.tactics}%\n`;
    text += `├─ ♜ Endshpil: ${student.weakAreas.endgame}%\n`;
    text += `├─ 📖 Ochilish: ${student.weakAreas.openings}%\n`;
    text += `├─ ⏰ Vaqt: ${student.weakAreas.timeManagement}%\n`;
    text += `└─ ⚠️ Blunder: ${student.weakAreas.blunders}%\n\n`;
    
    // Eng zaif tomonni topish
    const areas = [
      { name: 'Taktika', value: student.weakAreas.tactics },
      { name: 'Endshpil', value: student.weakAreas.endgame },
      { name: 'Ochilish', value: student.weakAreas.openings },
      { name: 'Vaqt boshqaruvi', value: student.weakAreas.timeManagement }
    ];
    
    const weakestArea = areas.reduce((min, a) => a.value < min.value ? a : min);
    
    text += `*🔴 Eng asosiy muammosi:* ${weakestArea.name} (${weakestArea.value}%)\n`;
    text += `*💡 Tavsiya:* Keyingi darsda "${weakestArea.name}" uchun maxsus meshq qiling.`;
    
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Orqaga', 'btn_back')]
      ])
    });
  } catch (error) {
    logger.error(`Progress handler xatosi: ${error.message}`);
    ctx.reply('❌ Statistika yuklanishida xatolik');
  }
};

module.exports = progressHandler;
