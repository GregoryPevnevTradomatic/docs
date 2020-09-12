import path from 'path';
import { DIRECTORIES, EXTENSIONS, DEFAULT_DIRECTORY, DEFAULT_EXTENSION } from '../constants';
import { DocumentFile } from '../../models';

export const pathForFileInBucket = (file: DocumentFile): string =>
  path.join(
    DIRECTORIES[file.fileType] || DEFAULT_DIRECTORY,
    // TODO: Using username "[bucket]/[user]/[file-id]"
    `${file.fileId}.${EXTENSIONS[file.fileType] || DEFAULT_EXTENSION}`,
  );
