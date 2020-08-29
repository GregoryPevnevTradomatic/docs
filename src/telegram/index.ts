import { Telegraf, Context, Middleware, session } from 'telegraf';
import { Api } from '../api';
import { createTelegramClient } from './client'
import { createUserLoaderMiddleware, createLoggerMiddleware } from './middleware';
import {
  createStartHandler,
  createHelpHandler,
  createErrorHandler,
  createMessageHandler
} from './handlers';

export interface TelegramBot {
  start: () => Promise<void>;
}

export const createTelegramBot = (botToken: string) => (api: Api): TelegramBot => {
  const telegramBot = new Telegraf(botToken);
  const telegramClient = createTelegramClient(botToken);

  telegramBot.use(session()); // Using Local session / File / Store
  telegramBot.use(createUserLoaderMiddleware(api) as Middleware<Context>);
  telegramBot.use(createLoggerMiddleware(api) as Middleware<Context>);

  telegramBot.start(createStartHandler(api) as Middleware<Context>);

  telegramBot.help(createHelpHandler(api) as Middleware<Context>);

  telegramBot.catch(createErrorHandler(api));

  telegramBot.on('message', createMessageHandler(api)(telegramClient) as Middleware<Context>);

  const start = async () => telegramBot.launch(); // Extra options???

  return { start };
};
