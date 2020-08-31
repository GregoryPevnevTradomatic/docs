import { User } from '../../models';

export interface LoadUser {
  (userId: string): Promise<User>;
}

export interface UpsertUser {
  (userId: string, username: string): Promise<User>;
}

export interface UserRepository {
  loadUser: LoadUser;
  upsertUser: UpsertUser;
}
