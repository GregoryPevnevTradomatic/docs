import { Services } from '../services';

export interface LogData {
  userId: string;
  data: unknown;
}

export interface LogApi {
  log(logData: LogData): Promise<void>;
}

const Log = (services: Services) =>
  async (logData: LogData): Promise<void> => {
    return;
  };

export const createLogApi = (services: Services): LogApi => ({
  log: Log(services),
});
