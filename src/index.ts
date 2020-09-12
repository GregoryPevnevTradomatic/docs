// Building implementations and injecting dependencies
import config from 'config';
import { Api, createApi } from './api';
import { Services } from './services';
import { createSQLRepositories, Repositories } from './database';
import { LocalStorage, CloudStorage, CloudStorageSettings } from './storage';
import { createDocumentTemplatesService } from './templates';
import { createTelegramBot, TelegramBot } from './telegram';
import { LocalStorageSettings } from './storage/local/common';
import { startHealthServer } from './utilities/server/health';

const postgresqlConnectionString: string = config.get('postgresqlConnectionString');
const telegramToken: string = config.get('telegramToken');
const localStorageSettings: LocalStorageSettings = config.get('localStorage');
const cloudStorageSettings: CloudStorageSettings = config.get('cloudStorage');
const cloudConvertKey: string = config.get('cloudConvertKey');
const healthServer: { port: number } = config.get('server');

const localStorage = LocalStorage(localStorageSettings);
const cloudStorage = CloudStorage(cloudStorageSettings);

const repositories: Repositories = createSQLRepositories(postgresqlConnectionString);

const services: Services = {
  ...repositories,
  templates: createDocumentTemplatesService({ cloudConvertKey }),
  // storage: LocalStorage(localStorageDirectory),
  storage: cloudStorage,
};

const api: Api = createApi(services);

const telegramBot: TelegramBot = createTelegramBot(telegramToken)(api);

process.on('uncaughtException', (e) => {
  console.error(e);
  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

module.exports = () => {
  telegramBot.start()
    .then(() => {
      console.log('Telegram bot started');
    });

  if(healthServer)
    startHealthServer(healthServer.port)('Healthy');
};
