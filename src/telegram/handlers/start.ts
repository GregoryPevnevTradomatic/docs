import { Middleware } from 'telegraf';
import { UserState, ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';
import { DefaultMessageText, clearKeyboard } from '../common/messages';

export const createStartHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    ctx.session.state = UserState.INITIAL;

    return ctx.reply(DefaultMessageText, clearKeyboard());
  };