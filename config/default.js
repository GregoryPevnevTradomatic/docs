const path = require('path'); // eslint-disable-line

const DEFAULT_POSTGRES = 'postgresql://postgres:1234@localhost:5432/docs-bot';

const DEFAULT_TELEGRAM_TOKEN = 'TEST-TOKEN';

const DEFAULT_LOCAL_STORAGE = path.join(__dirname, '..', 'files');
const LOCAL_STORAGE = String(process.env.LOCAL_STORAGE || DEFAULT_LOCAL_STORAGE);

const DEFAULT_CLOUD_CONVERT_KEY = 'TEST-KEY';
const CLOUD_CONVERT_KEY = String(process.env.CLOUD_CONVERT_KEY || DEFAULT_CLOUD_CONVERT_KEY);

module.exports = {
  // Database
  postgresqlConnectionString: String(process.env.POSTGRESQL || DEFAULT_POSTGRES),

  // Telegram
  telegramToken: String(process.env.TELEGRAM_TOKEN || DEFAULT_TELEGRAM_TOKEN),

  // Storage
  // Local Storage
  localStorage: {
    storagePath: LOCAL_STORAGE,
  },
  // Cloud Storage
  cloudStorage: {
    projectId: 'docs-bot-287308',
    credentialsFilePath: path.resolve(__dirname, '..', 'credentials', 'admin.json'),
    bucketName: 'docs-templates-bucket',
  },

  // Cloud Convert
  cloudConvertKey: CLOUD_CONVERT_KEY,
};
