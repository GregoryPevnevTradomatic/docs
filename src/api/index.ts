import { DocumentApi, createDocumentApi } from './documents';
import { UserApi, createUserApi } from './users';
import { LogApi, createLogApi } from './logs';
import { Services } from '../services';

export interface Api {
  documents: DocumentApi;
  users: UserApi;
  logs: LogApi;
}

export const createApi = (services: Services): Api => ({
  documents: createDocumentApi(services),
  users: createUserApi(services),
  logs: createLogApi(services),
});

export * from './documents';
export * from './users';
export * from './logs';
