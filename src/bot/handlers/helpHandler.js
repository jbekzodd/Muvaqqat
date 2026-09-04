const { Markup } = require('telegraf');
const logger = require('../../utils/logger');

const helpHandler = async (ctx) => {
  try {
    ctx.answerCbQuery();
    
    const helpText = `ℹ️ *MOVAQQAT QO'LLANMA*\n\n` +
      
      `*📚 Darslar*\n` +
      `Kelasi darslarning ro'yxatini ko'rish va jadvalini bilib olish.\n\n` +
      
      `*📝 Uy Vazifalar*\n` +
      `Ustoz bergan vazifalarni ko'rish va bajarishning holati.\n\n` +
      
      `*📊 Statistika*\n` +
      `Reyting, rivojlanish grafigi va zaif tomonlarni ko'rish.\n\n` +
      
      `*👑 Admin Panel* (Faqat admin)\n` +
      `Barcha o'quvchilar, darslar va vazifalarni boshqarish.\n\n` +
      
      `*🎯 Asosiy Xususiyatlar:*\n` +
      `✅ Real-time davomat\n` +
      `✅ Avtomatik eslatmalar\n` +
      `✅ Progress tracking\n` +
      `✅ AI tahlili (Lichess)\n` +
      `✅ Zaif tomonlar aniqlash\n\n` +
      
      `*📞 Aloqa:*\n` +
      `Muammolar uchun: @jovliyev_bekzod`;
    
    return ctx.editMessageText(helpText, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('◀️ Orqaga', 'btn_back')]
      ])
    });
  } catch (error) {
    logger.error(`Help handler xatosi: ${error.message}`);
    ctx.reply('❌ Xatolik yuz berdi');
  }
};

module.exports = helpHandler;
