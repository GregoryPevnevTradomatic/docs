const fs = require('fs'); // eslint-disable-line
const path = require('path'); // eslint-disable-line

const DEFAULT_POSTGRES = 'postgresql://postgres:1234@localhost:5432/docs-bot';

const DEFAULT_TELEGRAM_TOKEN = 'TEST-TOKEN';

const DEFAULT_LOCAL_STORAGE = path.join(__dirname, '..', 'files');
const LOCAL_STORAGE = String(process.env.LOCAL_STORAGE || DEFAULT_LOCAL_STORAGE);

// TODO: Making Sub-Directories
if (!fs.existsSync(LOCAL_STORAGE)) fs.mkdirSync(LOCAL_STORAGE);

module.exports = {
  postgresqlConnectionString: String(process.env.POSTGRESQL || DEFAULT_POSTGRES),
  telegramToken: String(process.env.TELEGRAM_TOKEN || DEFAULT_TELEGRAM_TOKEN),
  localStorageDirectory: LOCAL_STORAGE,
};
