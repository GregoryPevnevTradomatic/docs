import { Middleware } from 'telegraf';
import { ContextWithSession, NextFunction, TelegramUser } from '../common';
import { Api, UserData } from '../../api';
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
      const [user, document] = await Promise.all([
        api.users.getUser(data),
        api.documents.loadCurrentDocument(data.userId),
      ]);

      ctx.session.user = user;
      ctx.session.document = document;
      ctx.session.input = null;

      // Note: Could store exra session data -> Populate parameters
      if (document !== null && document.template !== null) {
        ctx.session.state = UserState.TEMPLATE_UPLOADED;
      } else {
        ctx.session.state = UserState.INITIAL;
      }
    }

    await next();
  };