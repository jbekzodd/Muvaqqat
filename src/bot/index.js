const { Telegraf, Markup } = require('telegraf');
const logger = require('../utils/logger');

// Handlers
const startHandler = require('./handlers/startHandler');
const lessonHandler = require('./handlers/lessonHandler');
const homeworkHandler = require('./handlers/homeworkHandler');
const progressHandler = require('./handlers/progressHandler');
const helpHandler = require('./handlers/helpHandler');
const { adminHandler, adminStudentsHandler, adminStatsHandler } = require('./handlers/adminHandler');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ==================== COMMAND HANDLERS ====================

bot.command('start', startHandler);

// ==================== BUTTON HANDLERS ====================

// Main menu buttons
bot.action('btn_lessons', lessonHandler);
bot.action('btn_homework', homeworkHandler);
bot.action('btn_stats', progressHandler);
bot.action('btn_help', helpHandler);
bot.action('btn_admin_panel', adminHandler);

// Admin buttons
bot.action('admin_students', adminStudentsHandler);
bot.action('admin_stats', adminStatsHandler);

// Back button
bot.action('btn_back', async (ctx) => {
  ctx.answerCbQuery();
  await startHandler(ctx);
});

// ==================== ERROR HANDLING ====================

bot.catch((err, ctx) => {
  logger.error(`Bot xatosi: ${err.message}`);
  ctx.reply('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
});

// ==================== TEXT MESSAGES ====================

bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  if (text.includes('salom') || text.includes('assalom')) {
    return ctx.reply('Wa alaikum assalom! 👋');
  }
  
  // Lichess URL tahlili
  if (text.includes('lichess.org')) {
    return ctx.reply('🎮 Lichess o\'yin tahlili (Tez orada)');
  }
  
  // Default
  return ctx.reply('❓ Nima deyapsiz? /start boshlang.');
});

// ==================== BOT INITIALIZATION ====================

const initializeBot = async () => {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    bot.launch();
    logger.success('✅ Telegram bot ishga tushdi');
  } catch (error) {
    logger.error(`Bot initialization xatosi: ${error.message}`);
    throw error;
  }
};

module.exports = { bot, initializeBot };
