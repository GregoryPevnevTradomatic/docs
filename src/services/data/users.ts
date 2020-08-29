import { User } from '../../models';

export interface LoadUser {
  (userId: string): Promise<User>;
}

export interface CreateUser {
  (userId: string, username: string): Promise<User>;
}

export interface UserRepository {
  loadUser: LoadUser;
  createUser: CreateUser;
}
