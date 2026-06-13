const app = require('./app');
const config = require('./config');
const connectDatabase = require('./config/database');
const logger = require('./utils/logger');

const start = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} (${config.env})`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
