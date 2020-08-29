export enum DocumentStatus {
  InProgress = 'in-progress',
  Aborted = 'aborted',
  Completed = 'completed',
}

export interface Document {
  docId: number;
  userId: string;
  status: DocumentStatus;
  parameters: string[];
  values: string[];
  template: string;
  result: string;
}
