import { Services } from '../services';

export interface LogData {
  userId: string;
  message: unknown;
}

export interface LogApi {
  log(logData: LogData): Promise<void>;
}

const Log = (services: Services) =>
  async ({ userId, message }: LogData): Promise<void> => {
    return services.logRepository.log(userId, message);
  };

export const createLogApi = (services: Services): LogApi => ({
  log: Log(services),
});
