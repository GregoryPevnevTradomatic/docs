import * as uuid from 'uuid';
import { FileData } from '../utilities';

export enum DocumentFileType {
  Template = 'template',
  Result = 'result'
}

export interface DocumentFile {
  fileId: string;
  fileName: string;
  fileType: DocumentFileType;
  fileData: FileData;
}

export const newFileId = (): string => String(uuid.v4());

export const templateFile = (filename: string, data: FileData = null): DocumentFile => ({
  fileId: newFileId(),
  fileName: filename,
  fileType: DocumentFileType.Template,
  fileData: data,
});

export const resultFile = (filename: string, data: FileData = null): DocumentFile => ({
  fileId: newFileId(),
  fileName: filename,
  fileType: DocumentFileType.Result,
  fileData: data,
});
