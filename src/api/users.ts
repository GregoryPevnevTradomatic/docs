import { User } from '../models';
import { Services } from '../services';

export interface UserData {
  userId: string;
  username: string;
}

export interface UserApi {
  getUser(userData: UserData): Promise<User>;
}

const GetUser = (services: Services) =>
  async (userData: UserData): Promise<User> => {
    return null;
  };

export const createUserApi = (services: Services): UserApi => ({
  getUser: GetUser(services),
});
