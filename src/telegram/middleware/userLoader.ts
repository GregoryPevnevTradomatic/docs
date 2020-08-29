import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction, TelegramUser } from '../common';
import { Api } from '../../api';
import { User } from './../../models';
import { UserState } from '../common/state';

const usernameFor = ({ first_name, last_name }: TelegramUser): string => {
  if(first_name && last_name) return `${first_name} ${last_name}`;
  if(first_name) return first_name;
  if(last_name) return last_name;

  return 'Unknown';
};

const userFrom = (telegramUser: TelegramUser): User => ({
  userId: String(telegramUser.id),
  username: usernameFor(telegramUser),
});

export const createUserLoaderMiddleware = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, next: NextFunction) => {
    if(!ctx.session.user) {
      const user: User = userFrom(ctx.message.from);

      // TODO: Loading user and document (When there are none)
      // TODO: Inferring current state based on the current document
      ctx.session.user = user;
      ctx.session.state = UserState.INITIAL;
    }

    await next();
  };