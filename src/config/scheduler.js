const cron = require('node-cron');
const logger = require('../utils/logger');

const schedulerTasks = [];

const registerTask = (cronExpression, taskName, taskFunction) => {
  try {
    const task = cron.schedule(cronExpression, async () => {
      try {
        logger.info(`⏰ ${taskName} ishga tushdi`);
        await taskFunction();
      } catch (error) {
        logger.error(`${taskName} xatosi: ${error.message}`);
      }
    });
    schedulerTasks.push({ taskName, task });
    logger.success(`✅ ${taskName} ro'yxatdan o'tdi`);
  } catch (error) {
    logger.error(`Task registratsiya xatosi: ${error.message}`);
  }
};

const stopAllTasks = () => {
  schedulerTasks.forEach(({ task, taskName }) => {
    task.stop();
    logger.info(`${taskName} to'xtatildi`);
  });
};

module.exports = { registerTask, stopAllTasks };
