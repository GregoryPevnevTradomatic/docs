import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  UserState,
  TelegramUser,
  parametersInputFromDocument,
} from '../common';
import { Api, UserData } from '../../api';

const usernameFor = ({ first_name, last_name }: TelegramUser): string => {
  if(first_name && last_name) return `${first_name} ${last_name}`;
  if(first_name) return first_name;
  if(last_name) return last_name;

  return 'Unknown'; // TODO: Constant
};

const userDataFrom = (telegramUser: TelegramUser): UserData => ({
  userId: String(telegramUser.id),
  username: usernameFor(telegramUser),
});

export const createAuthMiddleware = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, next: NextFunction) => {
    if(!ctx.session.user) {
      console.log('Loading User'); // TODO: Better logging

      const data: UserData = userDataFrom(ctx.message.from);
      const [user, document] = await Promise.all([
        api.users.getUser(data),
        api.documents.loadCurrentDocument(data.userId),
      ]);

      console.log('User:', user);
      console.log('Current-Document:', document);

      ctx.session.user = user;

      ctx.session.document = document;

      // Note: Could store exra session data -> Populate parameters
      if (document !== null && document.template !== null) {
        ctx.session.state = UserState.PARAMETERS_INPUT;
        ctx.session.input = parametersInputFromDocument(document);
      } else {
        ctx.session.state = UserState.TEMPLATE_UPLOAD;
        ctx.session.input = null;
      }
    }

    console.log('Session:', ctx.session);

    next();
  };