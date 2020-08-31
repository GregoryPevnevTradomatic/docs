import KnexClient from 'knex';
import { DocumentRepository, LogRepository, UserRepository } from '../services';
import { createSqlUserRepository } from './users';
import { createSqlDocumentRepository } from './documents';
import { createSqlLogRepository } from './logs';

export interface Repositories {
  userRepository: UserRepository;
  documentRepository: DocumentRepository;
  logRepository: LogRepository;
}

export const createSQLRepositories = (connectionString: string): Repositories => {
  const knex = KnexClient(connectionString);

  return {
    userRepository: createSqlUserRepository(knex),
    documentRepository: createSqlDocumentRepository(knex),
    logRepository: createSqlLogRepository(knex),
  };
};
