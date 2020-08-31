import uuid from 'uuid';

export enum DocumentFileType {
  Template = 'template',
  Result = 'result'
}

export interface DocumentFile {
  fileId: string;
  fileName: string;
  fileType: DocumentFileType;
}

export const newFileId = (): string => String(uuid.v4());

export const templateFile = (filename: string): DocumentFile => ({
  fileId: newFileId(),
  fileName: filename,
  fileType: DocumentFileType.Template,
});

export const resultFile = (filename: string): DocumentFile => ({
  fileId: newFileId(),
  fileName: filename,
  fileType: DocumentFileType.Result,
});
