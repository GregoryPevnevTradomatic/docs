import { Middleware } from 'telegraf';
import { UserState, ContextWithSession, NextFunction, isSessionInProgress } from '../common';
import { Api } from '../../api';
import { DefaultMessage, ClearKeyboard, ParameterInputMessage, InputKeyboard, TemplateInfoMessage } from '../common/messages';

export const createStartHandler = (_: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    if(isSessionInProgress(ctx.session)) {
      await ctx.reply(TemplateInfoMessage(ctx.session.input));

      return ctx.reply(ParameterInputMessage(ctx.session.input), InputKeyboard(ctx.session.input));
    }

    ctx.session.state = UserState.TEMPLATE_UPLOAD;

    return ctx.reply(DefaultMessage(), ClearKeyboard());
  };