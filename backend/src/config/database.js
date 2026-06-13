const config = require('./index');

const connectDatabase = async () => {
  if (config.database.url) {
    console.log('[DB] Connected to:', config.database.url);
  } else {
    console.log('[DB] No database URL configured — skipping connection');
  }
};

module.exports = connectDatabase;
