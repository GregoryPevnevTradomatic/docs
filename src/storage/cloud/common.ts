import path from 'path';
import { DIRECTORIES, EXTENSIONS, DEFAULT_DIRECTORY, DEFAULT_EXTENSION } from '../constants';
import { DocumentFile } from '../../models';

export const pathForFileInBucket = (file: DocumentFile): string =>
  // Note: Could also have user's ID / Username included into the path
  path.join(
    DIRECTORIES[file.fileType] || DEFAULT_DIRECTORY,
    `${file.fileId}.${EXTENSIONS[file.fileType] || DEFAULT_EXTENSION}`,
  );
