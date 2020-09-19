import { Middleware } from 'telegraf';
import { UserState, ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';
import { DefaultMessage, ClearKeyboard, ParameterInputMessage, InputKeyboard, TemplateInfoMessage } from '../common/messages';

// TODO: Session-Utility?
const isInProgress = ({ session }: ContextWithSession): boolean =>
  !!(session.state === UserState.PARAMETERS_INPUT && session.input && session.document);

export const createStartHandler = (_: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    if(isInProgress(ctx)) {
      await ctx.reply(TemplateInfoMessage(ctx.session.input));

      return ctx.reply(ParameterInputMessage(ctx.session.input), InputKeyboard(ctx.session.input));
    }

    ctx.session.state = UserState.TEMPLATE_UPLOAD;

    return ctx.reply(DefaultMessage(), ClearKeyboard());
  };