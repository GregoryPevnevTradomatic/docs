const path = require('path'); // eslint-disable-line

if(!process.env.CLOUD_PROJECT_ID|| !process.env.CLOUD_CONVERT_KEY || !process.env.CLOUD_STORAGE_BUCKET)
  throw new Error('Required environment variables not provided');

const DEFAULT_POSTGRES = 'postgresql://postgres:1234@localhost:5432/docs-bot';
const DEFAULT_TELEGRAM_TOKEN = 'TEST-TOKEN';
const DEFAULT_LOCAL_STORAGE = path.join(__dirname, '..', 'files');

const POSTGRES = String(process.env.POSTGRESQL || DEFAULT_POSTGRES);
const TELEGRAM_TOKEN = String(process.env.TELEGRAM_TOKEN || DEFAULT_TELEGRAM_TOKEN);
const LOCAL_STORAGE = String(process.env.LOCAL_STORAGE || DEFAULT_LOCAL_STORAGE);
const CLOUD_CONVERT_KEY = String(process.env.CLOUD_CONVERT_KEY);
const PROJECT_ID = String(process.env.CLOUD_PROJECT_ID);
const BUCKET = String(process.env.CLOUD_STORAGE_BUCKET);
const HEALTH_SERVER = process.env.HEALTH_SERVER;

module.exports = {
  // Database
  postgresqlConnectionString: POSTGRES,

  // Telegram
  telegramToken: TELEGRAM_TOKEN,

  // Storage
  // Local Storage
  localStorage: {
    storagePath: LOCAL_STORAGE,
  },
  // Cloud Storage
  cloudStorage: {
    projectId: PROJECT_ID,
    credentialsFilePath: path.resolve(__dirname, '..', 'credentials', 'admin.json'),
    bucketName: BUCKET,
  },

  server: HEALTH_SERVER ? {
    port: Number(HEALTH_SERVER),
  } : null,

  // Cloud Convert
  cloudConvertKey: CLOUD_CONVERT_KEY,
};
