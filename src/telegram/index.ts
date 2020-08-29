import { Telegraf, Context, Middleware, session } from 'telegraf';
import TelegramDocumentBotApi from 'node-telegram-bot-api';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Api } from '../api';
import { Document, parametersFrom, User } from '../models';
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES } from './common/constants';
import { UserState } from './common/state';
import { streamToBuffer } from '../internals';

type NextFunction = () => Promise<void>;

enum ParameterInputMode {
  OneByOne = 1,
  AllAtOnce = 2,
}

interface ParametersInput {
  mode: ParameterInputMode;
  parameters: string[];
  values: string[];
}

interface ContextSession {
  state: UserState;
  user: User;
  document: Document;
  input: ParametersInput;
}

interface ContextWithSession extends Context {
  session: ContextSession;
}

export interface TelegramBot {
  start: () => Promise<void>;
}

interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
}

interface TelegramFile {
  file_id: string;
  file_name?: string;
  mime_type?: string;
}

const isValidFile = (file: TelegramFile): boolean => {
  if(file.mime_type && SUPPORTED_MIME_TYPES.includes(file.mime_type)) return true;
  if(file.file_name && SUPPORTED_EXTENSIONS.includes(path.extname(file.file_name))) return true;

  return false;
};

const usernameFor = ({ first_name, last_name }: TelegramUser): string => {
  if(first_name && last_name) return `${first_name} ${last_name}`;
  if(first_name) return first_name;
  if(last_name) return last_name;

  return 'Unknown';
};

const userFrom = (telegramUser: TelegramUser): User => ({
  userId: String(telegramUser.id),
  username: usernameFor(telegramUser),
});

// Ask: Is this ACTUALLY helpful???
const extractParametersFromText = (text: string) =>
  text
    .trim()
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .map((param: string) => param.trim())
    .filter((param: string) => param.length !== 0);

const isParametersInputComplete = (input: ParametersInput) =>
  input.parameters.length === input.values.length;

export const createTelegramBot = (botToken: string) => (api: Api): TelegramBot => {
  const telegramBot = new Telegraf(botToken);
  const telegramClient = new TelegramDocumentBotApi(botToken, { polling: false });

  const downloadFileFromTelegram = async (file: TelegramFile): Promise<Buffer> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, result => resolve(streamToBuffer(result)))
    );
  };

  const userMiddleware: Middleware<ContextWithSession> = async (ctx: ContextWithSession, next: NextFunction) => {
    const user: User = userFrom(ctx.message.from);

    console.log('User', user);

    // TODO: Loading user and document
    // TODO: Inferring current state based on the current document
    ctx.session.user = user;

    await next();
  };

  const logMiddleware: Middleware<ContextWithSession> = async (ctx: ContextWithSession, next: NextFunction) => {
    console.log(ctx.message);

    await next();

    // Logging out result of a message (Request log / Response log)?
  };

  const startHandler = async (ctx: ContextWithSession, _: NextFunction) => {
    ctx.reply('Feed me documents');
    ctx.session.state = UserState.INITIAL;
  };

  const helpHandler = async (ctx: ContextWithSession, _: NextFunction) => {
    ctx.reply('Send documents with "{}" tags surrounding parameters');
  };

  const errorHandler = async (error: Error, ctx: ContextWithSession) => {
    console.log(error);

    ctx.reply('Something went wrong');
    ctx.session.state = UserState.INITIAL;
  };

  const messageHandler = async (ctx: ContextWithSession, _: NextFunction) => {
    const photo = ctx.message?.photo;
    const file: TelegramFile = ctx.message?.document;

    if (photo) {
      return ctx.reply('Images and photoes are not supported');
    }

    if (file) {
      if(!isValidFile(file)) return ctx.reply('Invalid file (Only DOCX files are supported)');

      const data: Buffer = await downloadFileFromTelegram(file);

      // TODO:  Starting a new template
      // TODO:  Send error in case of processing going wrong

      fs.writeFileSync(path.resolve(__dirname, '..', '..', 'files', `${Date.now()}.docx`), data);

      ctx.session.document = {
        docId: 1,
        userId: "2",
        status: null,
        parameters: { 'P1': null, 'P2': null, "P3": null },
        template: null,
        result: null,
      }; 
      ctx.session.input = null;
      ctx.session.state = UserState.TEMPLATE_UPLOADED;

      // TODO: Send Buttons
      return ctx.reply('Select Parameter-Entering Mode');
    }

    // TODO: Map handler using Map / Dictionary
    switch(ctx.session.state) {
      case UserState.TEMPLATE_UPLOADED:
        ctx.session.state = UserState.ENTERING_PARAMETERS;
        ctx.session.input = {
          mode: ctx.message.text === 'ALL' ? ParameterInputMode.AllAtOnce : ParameterInputMode.OneByOne,
          parameters: Object.keys(ctx.session.document.parameters).sort(),
          values: [],
        };

        if(ctx.message.text === 'ALL')
          return ctx.reply(
            `Enter parameters in the order as follows:\n${ctx.session.input.parameters.join(', ')}`
          );
        
        return ctx.reply(`Enter "${ctx.session.input.parameters[0]}":`);
      case UserState.ENTERING_PARAMETERS:
        if(ctx.session.input.mode === ParameterInputMode.AllAtOnce) {
          ctx.session.input.values = extractParametersFromText(ctx.message.text);

          console.log(ctx.session.input);

          if(!isParametersInputComplete(ctx.session.input))
            return ctx.reply('Invalid number of parameters, try again');
        } else {
          // Ask: Abortion button?
          ctx.session.input.values.push(ctx.message.text);

          if(!isParametersInputComplete(ctx.session.input))
            return ctx.reply(
              `Enter "${ctx.session.input.parameters[ctx.session.input.values.length]}":`
            );
        }

        ctx.session.document.parameters = parametersFrom(
          ctx.session.input.parameters,
          ctx.session.input.values,
        );

        console.log('Parameters:', ctx.session.document.parameters);

        ctx.session.state = UserState.INITIAL;
        ctx.reply('Wait...');

        // Supports Buffers / Streams / Filepaths (LOCAL ONLY)
        //  -> Use a different method when sending URL to a file
        // await telegramClient.sendDocument(
        //   ctx.message.chat.id,
        //   path.resolve(__dirname, '..', '..', 'files', 'test.docx'),
        // );
        break;
      case UserState.INITIAL:
      default:
        return ctx.reply('Send me a document first');
    }
  };

  telegramBot.use(session()); // Using Local session / File / Store
  telegramBot.use(userMiddleware as Middleware<Context>);
  telegramBot.use(logMiddleware as Middleware<Context>);

  telegramBot.start(startHandler as Middleware<Context>);

  telegramBot.help(helpHandler as Middleware<Context>);

  telegramBot.catch(errorHandler);

  telegramBot.on('message', messageHandler as Middleware<Context>);

  const start = async () => telegramBot.launch(); // Extra options???

  return { start };
};
