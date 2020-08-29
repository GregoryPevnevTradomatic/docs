import { Middleware } from 'telegraf';
import { UserState, ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';

export const createStartHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    ctx.session.state = UserState.INITIAL;

    return ctx.reply('Feed me documents');
  };