import { DocumentParameters } from './common';

export enum DocumentFileType {
  Template = 'template',
  Result = 'result'
}

export enum DocumentStatus {
  InProgress = 'in-progress',
  Aborted = 'aborted',
  Completed = 'completed',
}

export interface DocumentFile {
  fileId: string;
  fileType: DocumentFileType;
  fileName: string;
}

export interface Document {
  docId: number;
  userId: string;
  status: DocumentStatus;
  parameters: DocumentParameters;
  template: DocumentFile;
  result: DocumentFile;
}
