import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParameterInputMode,
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
import { initialSessionFor } from '../../common/session';

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

      const progressControl = await telegramClient.progress(
        ctx.message.chat.id,
        ['Loading file', 'Processing file', 'Converting to PDF', 'Sending it to you'],
        // TODO: Determine base on file-size
        5000, // Total of 12s (Average)
      );

      await progressControl.start();

      const parameters: DocumentParameters = parametersFrom(
        input.parameters,
        input.values,
      );
  
      const result = await api.documents.processDocument(document, parameters);

      await progressControl.finish();
  
      ctx.session = initialSessionFor(ctx.session.user);
  
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
