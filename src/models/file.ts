export enum DocumentFileType {
  Template = 'template',
  Result = 'result'
}

export interface DocumentFile {
  fileId: string;
  fileType: DocumentFileType;
  fileName: string;
}
