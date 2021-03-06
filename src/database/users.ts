import KnexClient from 'knex';
import { User } from '../models';
import { UserRepository, LoadUser, UpsertUser } from '../services';
import { currentTimestamp } from '../utilities';

interface SqlUserData {
  user_id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

const userFromData = ({ user_id, username }: SqlUserData): User => ({
  userId: user_id,
  username,
});

const LoadUserSql = (knex: KnexClient): LoadUser => (userId) =>
  knex.select(['user_id', 'username']).from('users')
    .where({ 'user_id': userId })
    .limit(1)
    .then(result => 
      result.length > 0 ? userFromData(result[0]) : null
    );

const UpsertUserSql = (knex: KnexClient): UpsertUser => (userId, username) =>
  knex.raw(`
      INSERT INTO users(user_id, username) VALUES (?, ?)
      ON CONFLICT (user_id)
      DO UPDATE SET username = ?, updated_at = ?
      RETURNING *
    `, [userId, username, username, currentTimestamp()]).then(({ rows }) =>
      rows.length > 0 ? userFromData(rows[0]) : null
    );

export const createSqlUserRepository = (knex: KnexClient): UserRepository =>
  ({
    loadUser: LoadUserSql(knex),
    upsertUser: UpsertUserSql(knex),
  });
