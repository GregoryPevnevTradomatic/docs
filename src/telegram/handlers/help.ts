import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';
import { DefaultMessage } from '../common/messages';

export const createHelpHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    return ctx.reply(DefaultMessage());
  };