import KnexClient from 'knex';
import { LogRepository, SaveLog } from '../services';

const LogDataSql = (knex: KnexClient): SaveLog =>
  async (userId, data) => {
    await knex('logs').insert({
      'user_id': userId,
      'log_data': data,
    });
  };

export const createSqlLogRepository = (knex: KnexClient): LogRepository =>
  ({
    log: LogDataSql(knex),
  });
