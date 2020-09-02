import { DocumentParameters } from './parameters';
import { DocumentFile } from './file';

export enum DocumentStatus {
  InProgress = 'in-progress',
  Aborted = 'aborted',
  Completed = 'completed',
}

export interface Document {
  docId: number;
  userId: string;
  status: DocumentStatus;
  parameters: DocumentParameters;
  template: DocumentFile;
  result: DocumentFile;
}
