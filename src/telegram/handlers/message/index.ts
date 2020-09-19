import { MiddlewareFn } from 'telegraf/typings/composer';
import { TelegramClient } from '../../client';
import { UserState, ContextWithSession, NextFunction, ErrorMessage, UnknownCommandMessage, resetSession } from '../../common';
import { Api } from '../../../api';
import { createTemplateUploadHandler } from './templateUpload';
import { createParameterInputHandler } from './parameterInput';

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

    return async (ctx: ContextWithSession, next: NextFunction) => {
      try {
        if(ctx.message.photo || ctx.message.document) {
          await uploadHandler(ctx, next);
          return;
        }

        const handler = handlers[ctx.session.state];

        if(handler) await handler(ctx, next);
        else await ctx.reply(UnknownCommandMessage());
      } catch (error) {
        console.log('Error:', error);
    
        resetSession(ctx).reply(ErrorMessage());
      }
    };
  };