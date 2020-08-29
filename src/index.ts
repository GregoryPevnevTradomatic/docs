// Building implementations and injecting dependencies
import config from 'config';
import { createTelegramBot, TelegramBot } from './telegram';

const telegramBot: TelegramBot = createTelegramBot(config.get('telegramToken'))(null);

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
