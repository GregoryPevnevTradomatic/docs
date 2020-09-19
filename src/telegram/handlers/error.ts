import { UserState, ContextWithSession, resetSession } from '../common';
import { Api } from '../../api';
import { ErrorMessage } from '../common/messages';

interface ErrorHandler {
  (err: Error, ctx: ContextWithSession): Promise<void>;
}

export const createErrorHandler = (api: Api): ErrorHandler =>
  async (error: Error, ctx: ContextWithSession) => {
    console.log('Error:', error);
    
    resetSession(ctx).reply(ErrorMessage());
  };