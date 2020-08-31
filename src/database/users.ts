import KnexClient from 'knex';
import { User } from '../models';
import { UserRepository, LoadUser, UpsertUser } from '../services';
import { currentTimestamp } from '../utilities';

interface UserData {
  user_id: string;
  username: string;
}

const formatUser = ({ user_id, username }: UserData): User => ({
  userId: user_id,
  username,
});

export const createSqlUserRepository = (knex: KnexClient): UserRepository => {
  const loadUser: LoadUser = async (userId: string): Promise<User> =>
    knex.select(['user_id', 'username']).from('users')
      .where({ 'user_id': userId })
      .limit(1)
      .then(result => 
        result.length > 0 ? formatUser(result[0]) : null
      );

  const upsertUser: UpsertUser = async (userId: string, username: string): Promise<User> =>
    knex.raw(`
      INSERT INTO users(user_id, username) VALUES (?, ?)
      ON CONFLICT (user_id)
      DO UPDATE SET username = ?, updated_at = ?
      RETURNING *
    `, [userId, username, username, currentTimestamp()]).then(({ rows }) =>
      rows.length > 0 ? formatUser(rows[0]) : null
    );

  return { loadUser, upsertUser };
};
