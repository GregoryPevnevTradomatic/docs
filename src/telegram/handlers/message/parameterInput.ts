import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParametersInput,
  ParameterInputMode,
  UserState,
  currentOption,
  abortButton,
} from '../../common';
import { Api } from '../../../api';
import { DocumentParameters, parametersFrom } from '../../../models';
import { AbortCommand } from '../../common/constants';
import { clearKeyboard } from '../../common/messages';
import { TelegramClient } from '../../client';

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

export const createParameterInputHandler = (api: Api) => (telegramClient: TelegramClient): Middleware<ContextWithSession> => 
  async (ctx: ContextWithSession, _: NextFunction) => {
    const text = ctx.message.text;
    const mode = ctx.session.input.mode;
    const input = ctx.session.input;

    if(mode === ParameterInputMode.AllAtOnce) {
      input.values = extractParametersFromText(ctx.message.text);
    } else {
      if(text === AbortCommand) input.values = [];
      else input.values.push(text);
    }

    if(!isParametersInputComplete(input)) {
      if(mode === ParameterInputMode.AllAtOnce) {
        return ctx.reply('Invalid number of parameters, try again');
      } else {
        return ctx.reply(currentOption(input), abortButton());
      }
    }

    await ctx.reply('Wait...', clearKeyboard());

    const parameters: DocumentParameters = parametersFrom(
      input.parameters,
      input.values,
    );

    const result = await api.documents.processDocument(ctx.session.document, parameters);

    // TODO: Function for resetting
    ctx.session.state = UserState.INITIAL;
    ctx.session.document = null;
    ctx.session.input = null;

    return telegramClient.uploadFile(ctx.message.chat.id, result);
  };
