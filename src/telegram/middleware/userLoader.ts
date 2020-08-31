import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction, TelegramUser } from '../common';
import { Api, UserData } from '../../api';
import { User } from './../../models';
import { UserState } from '../common/state';

const usernameFor = ({ first_name, last_name }: TelegramUser): string => {
  if(first_name && last_name) return `${first_name} ${last_name}`;
  if(first_name) return first_name;
  if(last_name) return last_name;

  return 'Unknown';
};

const userDataFrom = (telegramUser: TelegramUser): UserData => ({
  userId: String(telegramUser.id),
  username: usernameFor(telegramUser),
});

export const createUserLoaderMiddleware = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, next: NextFunction) => {
    if(!ctx.session.user) {
      const data: UserData = userDataFrom(ctx.message.from);
      const user: User = await api.users.getUser(data);

      ctx.session.user = user;

      // TODO: Loading the current document
      ctx.session.document = null;

      // TODO: Inferring current state based on the current document
      ctx.session.state = UserState.INITIAL;

      // TODO: Populating input based on the document
      ctx.session.input = null;
    }

    await next();
  };