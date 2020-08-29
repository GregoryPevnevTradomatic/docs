import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction } from '../common/types';
import { Api } from '../../api';

export const createLoggerMiddleware = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, next: NextFunction) => {
    console.log(ctx.session.user, ctx.message);

    await next();

    // Logging out result of a message (Request log / Response log)?
  };
