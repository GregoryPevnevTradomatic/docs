import { Middleware } from 'telegraf';
import {
  DefaultMessage,
  ProcessingSteps,
  ContextWithSession,
  NextFunction,
  BackCommand,
  popParameter,
  pushParameter,
  isParametersInputComplete,
  ParametersListMessage,
  ParameterInputMessage,
  InputKeyboard,
  ClearKeyboard,
  CancelCommand,
  resetSession,
  isParametersInputEmpty,
} from '../../common';
import { Api } from '../../../api';
import { DocumentParameters, parametersFrom } from '../../../models';
import { TelegramClient } from '../../client';

export const createParameterInputHandler = (api: Api) => 
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const incompleteHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const input = ctx.session.input;

      if(!isParametersInputEmpty(input))
        await ctx.reply(ParametersListMessage(input));

      return ctx.reply(
        ParameterInputMessage(input),
        InputKeyboard(input),
      );
    };

    const completeHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const input = ctx.session.input;
      const document = ctx.session.document;

      const progressControl = await telegramClient.progress(
        ctx.message.chat.id,
        ProcessingSteps,
        6000, // Total of 18s (Average)
      );

      await progressControl.start();

      const parameters: DocumentParameters = parametersFrom(
        input.parameters,
        input.values,
      );
  
      const result = await api.documents.processDocument(document, parameters);

      await progressControl.finish();
  
      await telegramClient.uploadFile(ctx.message.chat.id, result);

      return resetSession(ctx).reply(DefaultMessage(), ClearKeyboard());
    };

    const inputHandler = async (ctx: ContextWithSession, next: NextFunction) => {
      const text = ctx.message.text;
      const { input, document } = ctx.session;

      // All parameters are entered -> Waiting for the processing to complete
      // Next Version: Separate state
      if(isParametersInputComplete(input))
        return;

      if (text === CancelCommand) {
        await api.documents.abortDocument(document);

        return resetSession(ctx).reply(DefaultMessage(), ClearKeyboard());
      }

      input.values = (
        text === BackCommand ?
          popParameter(input.values) :
          pushParameter(input.values, text)
      );

      if(!isParametersInputComplete(input))
        return incompleteHandler(ctx, next);

      return completeHandler(ctx, next);
    };

    return inputHandler;
  };
