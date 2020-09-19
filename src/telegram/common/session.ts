import { Context } from 'telegraf';
import { ParametersInput } from './models';
import { UserState } from './state';
import { Document, User } from '../../models';

export interface ContextSession {
  state: UserState;
  user: User;
  document: Document;
  input: ParametersInput;
}

export interface ContextWithSession extends Context {
  session: ContextSession;
}

export const resetSession = (ctx: ContextWithSession): ContextWithSession => {
  ctx.session.state = UserState.TEMPLATE_UPLOAD;
  ctx.session.document = null;
  ctx.session.input = null;

  return ctx;
};