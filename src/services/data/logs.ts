export interface SaveLog {
  (userId: string, data: unknown): Promise<void>;
}

export interface LogRepository {
  log: SaveLog;
}
