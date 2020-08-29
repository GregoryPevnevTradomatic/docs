import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';

export const createHelpHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    return ctx.reply('Send documents with "{}" tags surrounding parameters');
  };