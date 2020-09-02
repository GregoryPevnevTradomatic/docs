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

export const initialSessionFor = (user: User): ContextSession => ({
  state: UserState.INITIAL,
  document: null,
  input: null,
  user,
});
