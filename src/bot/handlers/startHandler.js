const { Markup } = require('telegraf');
const logger = require('../../utils/logger');

const startHandler = async (ctx) => {
  try {
    const userId = ctx.from?.id;
    const username = ctx.from?.username || 'Foydalanuvchi';
    
    logger.info(`Bot /start: ${username} (ID: ${userId})`);
    
    const welcomeText = `♞ *Assalomu alaykum, ${username}!*\n\n` +
      `*MOVAQQAT — Shaxmatda Rivojlanishning Yo'li*\n\n` +
      `🎯 Quyidagi bo'limlardan birini tanlang:`;
    
    const buttons = [
      [Markup.button.callback('📚 Darslar', 'btn_lessons')],
      [Markup.button.callback('📝 Uy Vazifalar', 'btn_homework')],
      [Markup.button.callback('📊 Statistika', 'btn_stats')],
      [Markup.button.callback('ℹ️ Yordam', 'btn_help')],
    ];
    
    // Admin uchun qo'shimcha knopka
    if (username === 'jovliyev_bekzod' || ctx.from?.is_bot === false) {
      buttons.push([Markup.button.callback('👑 Admin Panel', 'btn_admin_panel')]);
    }
    
    return ctx.reply(welcomeText, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(buttons)
    });
  } catch (error) {
    logger.error(`Start handler xatosi: ${error.message}`);
    ctx.reply('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
  }
};

module.exports = startHandler;
