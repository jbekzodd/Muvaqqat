const { Telegraf } = require('telegraf');
const logger = require('../utils/logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

const setupTelegram = async () => {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    logger.success('Telegram bot sozlandi');
  } catch (error) {
    logger.error(`Telegram setup xatosi: ${error.message}`);
    throw error;
  }
};

module.exports = { bot, setupTelegram };
