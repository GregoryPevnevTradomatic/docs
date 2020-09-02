import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParameterInputMode,
  UserState,
  BackCommand,
  popParameter,
  pushParameter,
  isParametersInputComplete,
  currentOption,
  abortButton,
} from '../../common';
import { Api } from '../../../api';
import { DocumentParameters, parametersFrom } from '../../../models';
import { TelegramClient } from '../../client';
import { clearKeyboard } from '../../common/messages';

// Ask: Is this ACTUALLY helpful???
const extractParametersFromText = (text: string) =>
  text
    .trim()
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .map((param: string) => param.trim())
    .filter((param: string) => param.length !== 0);

export const createParameterInputHandler = (api: Api) => 
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const incompleteHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const input = ctx.session.input;

      if(input.mode === ParameterInputMode.AllAtOnce)
        return ctx.reply('Invalid number of parameters, try again');

      if(input.values.length === 0)
        return ctx.reply(currentOption(input));

      return ctx.reply(currentOption(input), abortButton());
    };

    const completeHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const input = ctx.session.input;
      const document = ctx.session.document;

      await ctx.reply('Wait...', clearKeyboard());

      const parameters: DocumentParameters = parametersFrom(
        input.parameters,
        input.values,
      );
  
      const result = await api.documents.processDocument(document, parameters);
  
      // TODO: Function for resetting
      ctx.session.state = UserState.INITIAL;
      ctx.session.document = null;
      ctx.session.input = null;

      console.log('Result', result);
  
      return telegramClient.uploadFile(ctx.message.chat.id, result);
    };

    const inputHandler = async (ctx: ContextWithSession, next: NextFunction) => {
      const text = ctx.message.text;
      const mode = ctx.session.input.mode;
      const input = ctx.session.input;

      if(mode === ParameterInputMode.AllAtOnce) {
        input.values = extractParametersFromText(ctx.message.text);
      } else {
        input.values = (
          text === BackCommand ?
            popParameter(input.values) :
            pushParameter(input.values, text)
        );
      }

      if(!isParametersInputComplete(input))
        return incompleteHandler(ctx, next);

      return completeHandler(ctx, next);
    };

    return inputHandler;
  };
