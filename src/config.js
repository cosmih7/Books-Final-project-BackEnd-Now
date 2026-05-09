const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/reading-list',
  JWT_SECRET: process.env.JWT_SECRET || 'secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h'
};
