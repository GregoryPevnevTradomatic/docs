import { Context } from 'telegraf';
import { Document, User } from '../../models';
import { UserState } from './state';
import { ParameterInputMode } from './constants';

// Handlers

export type NextFunction = () => Promise<void>;

// Session

export interface ParametersInput {
  mode: ParameterInputMode;
  parameters: string[];
  values: string[];
}

export interface ContextSession {
  state: UserState;
  user: User;
  document: Document;
  input: ParametersInput;
}

export interface ContextWithSession extends Context {
  session: ContextSession;
}

