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
  async ({ userId, username }: UserData): Promise<User> => {
    return services.userRepository.upsertUser(userId, username);
  };

export const createUserApi = (services: Services): UserApi => ({
  getUser: GetUser(services),
});
