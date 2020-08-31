import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction } from '../common';
import { Api } from '../../api';

export const createLoggerMiddleware = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, next: NextFunction) => {
    await api.logs.log({
      userId: ctx.session.user.userId,
      message: ctx.message,
    })

    await next();

    // Logging out result of a message (Request log / Response log)?
  };
