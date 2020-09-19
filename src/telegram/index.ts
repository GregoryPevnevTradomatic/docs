import { Telegraf, Context, Middleware, session } from 'telegraf';
import { Api } from '../api';
import { createTelegramClient } from './client'
import { createAuthMiddleware, createLoggerMiddleware } from './middleware';
import {
  createStartHandler,
  createHelpHandler,
  createErrorHandler,
  createMessageHandler
} from './handlers';

// TODO: Separate
const MESSAGE_ACTION = 'message';

export interface TelegramBot {
  start: () => Promise<void>;
}

export const createTelegramBot = (botToken: string) => (api: Api): TelegramBot => {
  const telegramBot = new Telegraf(botToken);
  const telegramClient = createTelegramClient(botToken);

  telegramBot.use(session()); // Using Local session / File / Store
  telegramBot.use(createAuthMiddleware(api) as Middleware<Context>);
  telegramBot.use(createLoggerMiddleware(api) as Middleware<Context>);

  telegramBot.start(createStartHandler(api) as Middleware<Context>);

  telegramBot.help(createHelpHandler(api) as Middleware<Context>);

  telegramBot.catch(createErrorHandler(api));

  telegramBot.on(MESSAGE_ACTION, createMessageHandler(api)(telegramClient) as Middleware<Context>);

  const start = async () => telegramBot.launch(); // Extra options???

  return { start };
};
