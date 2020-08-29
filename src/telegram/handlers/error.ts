import { UserState, ContextWithSession } from '../common';
import { Api } from '../../api';

interface ErrorHandler {
  (err: Error, ctx: ContextWithSession): Promise<void>;
}

export const createErrorHandler = (api: Api): ErrorHandler =>
  async (error: Error, ctx: ContextWithSession) => {
    console.log('Error:', error);

    ctx.session.state = UserState.INITIAL;

    ctx.reply('Something went wrong');
  };