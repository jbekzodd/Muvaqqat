const logger = {
  info: (msg) => {
    console.log(`ℹ️  [${new Date().toISOString()}] ${msg}`);
  },
  error: (msg) => {
    console.error(`❌ [${new Date().toISOString()}] ${msg}`);
  },
  warn: (msg) => {
    console.warn(`⚠️  [${new Date().toISOString()}] ${msg}`);
  },
  success: (msg) => {
    console.log(`✅ [${new Date().toISOString()}] ${msg}`);
  }
};

module.exports = logger;
