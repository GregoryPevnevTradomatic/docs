import { DocumentFileType } from '../models';

export const DIRECTORIES = {
  [DocumentFileType.Result]: 'results',
  [DocumentFileType.Template]: 'templates',
};

export const DEFAULT_DIRECTORY = 'other';

export const EXTENSIONS = {
  [DocumentFileType.Result]: 'pdf',
  [DocumentFileType.Template]: 'docx',
};

export const DEFAULT_EXTENSION = 'txt';
