import { DocumentFile } from './file';

export enum DocumentStatus {
  InProgress = 'in-progress',
  Aborted = 'aborted',
  Completed = 'completed',
}

export interface DocumentParameters {
  [name:string]: string;
}

export interface Document {
  docId: number;
  userId: string;
  status: DocumentStatus;
  parameters: DocumentParameters;
  template: DocumentFile;
  result: DocumentFile;
}

export const parametersFrom = (names: string[], values: string[]): DocumentParameters =>
  names.reduce((result: DocumentParameters, name: string, index: number) => ({
    ...result,
    [name]: values[index],
  }), {});
