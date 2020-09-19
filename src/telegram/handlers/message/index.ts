import { MiddlewareFn } from 'telegraf/typings/composer';
import { TelegramClient } from '../../client';
import { UserState, ContextWithSession, NextFunction } from '../../common';
import { Api } from '../../../api';
import { createTemplateUploadHandler } from './templateUpload';
import { createParameterInputHandler } from './parameterInput';
import { UnknownCommandMessage } from '../../common/messages';

interface MessageHandlers {
  [state: number]: MiddlewareFn<ContextWithSession>;
}

export const createMessageHandler = (api: Api) =>
  (telegramClient: TelegramClient): MiddlewareFn<ContextWithSession> => {
    const uploadHandler = createTemplateUploadHandler(api)(telegramClient) as MiddlewareFn<ContextWithSession>;
    const inputHandler = createParameterInputHandler(api)(telegramClient) as MiddlewareFn<ContextWithSession>;

    const handlers: MessageHandlers = {
      [UserState.TEMPLATE_UPLOAD]: uploadHandler,
      [UserState.PARAMETERS_INPUT]: inputHandler,
    };

    return (ctx: ContextWithSession, next: NextFunction) => {
      if(ctx.message.photo || ctx.message.document)
        return uploadHandler(ctx, next);

      const handler = handlers[ctx.session.state];

      if(handler) return handler(ctx, next);

      return ctx.reply(UnknownCommandMessage());
    };
  };