// Building implementations and injecting dependencies
import config from 'config';
import { Api, createApi } from './api';
import { Services } from './services';
import { createSQLRepositories, Repositories } from './database';
import { createLocalStorage } from './storage';
import { createTelegramBot, TelegramBot } from './telegram';

const telegramToken: string = config.get('telegramToken');
const localStorageDirectory: string = config.get('localStorageDirectory');
const postgresqlConnectionString: string = config.get('postgresqlConnectionString');

const repositories: Repositories = createSQLRepositories(postgresqlConnectionString);

const services: Services = {
  ...repositories,
  templates: null,
  storage: createLocalStorage(localStorageDirectory),
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

telegramBot.start()
  .then(() => {
    console.log('Telegram bot started');
  });
