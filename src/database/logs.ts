import KnexClient from 'knex';
import { LogRepository, SaveLog } from '../services';

export const createSqlLogRepository = (knex: KnexClient): LogRepository => {
  const log: SaveLog = async (userId: string, data: unknown): Promise<void> => {
    await knex('logs').insert({
      user_id: userId,
      log_message: data,
    });
  };

  return { log };
};
