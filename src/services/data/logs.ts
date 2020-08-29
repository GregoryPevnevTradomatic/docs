export interface LogMessage {
  (userId: string, data: unknown): Promise<void>;
}

export interface LogRepository {
  log: LogMessage;
}
