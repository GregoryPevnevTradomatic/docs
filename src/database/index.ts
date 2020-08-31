import KnexClient from 'knex';
import { LogRepository, UserRepository } from '../services';
import { createSqlLogRepository } from './logs';
import { createSqlUserRepository } from './users';

export interface Repositories {
  userRepository: UserRepository;
  logRepository: LogRepository;
}

export const createSQLRepositories = (connectionString: string): Repositories => {
  const knex = KnexClient(connectionString);

  return {
    userRepository: createSqlUserRepository(knex),
    logRepository: createSqlLogRepository(knex),
  };
};
