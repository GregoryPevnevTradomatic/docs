import { MiddlewareFn } from 'telegraf/typings/composer';
import { TelegramClient } from '../../client';
import { UserState, ContextWithSession, NextFunction } from '../../common';
import { Api } from '../../../api';
import { createTemplateUploadHandler } from './templateUpload';
import { createParameterChoiceHandler } from './parametersChoice';
import { createParameterInputHandler } from './parameterInput';
import { UnknownCommandText } from '../../common/messages';

interface MessageHandlers {
  [state: number]: MiddlewareFn<ContextWithSession>;
}

export const createMessageHandler = (api: Api) =>
  (telegramClient: TelegramClient): MiddlewareFn<ContextWithSession> => {
    const uploadHandler = createTemplateUploadHandler(api)(telegramClient) as MiddlewareFn<ContextWithSession>;
    const choiceHandler = createParameterChoiceHandler(api) as MiddlewareFn<ContextWithSession>;
    const inputHandler = createParameterInputHandler(api)(telegramClient) as MiddlewareFn<ContextWithSession>;

    const handlers: MessageHandlers = {
      [UserState.INITIAL]: uploadHandler,
      [UserState.TEMPLATE_UPLOADED]: choiceHandler,
      [UserState.ENTERING_PARAMETERS]: inputHandler,
    };

    return (ctx: ContextWithSession, next: NextFunction) => {
      if(ctx.message.photo || ctx.message.document)
        return uploadHandler(ctx, next);

      const handler = handlers[ctx.session.state];

      if(handler) return handler(ctx, next);

      return ctx.reply(UnknownCommandText);
    };
  };