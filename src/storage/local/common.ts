import fs from 'fs';
import path from 'path';
import { DIRECTORIES } from '../constants';
import { DocumentFile } from '../../models';

export interface LocalStorageSettings {
  storagePath: string;
}

export const pathForLocalFile = (storagePath: string, file: DocumentFile): string =>
  path.join(storagePath, DIRECTORIES[file.fileType] || 'other', file.fileId);

export const saveStream = (filepath: string, stream: NodeJS.ReadableStream): Promise<void> =>
  new Promise((res, rej) => {
    stream.pipe(fs.createWriteStream(filepath))
      .on('finish', res)
      .on('error', rej)
  });

const initializeDirectory = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
};

export const initializeDirectories = (rootPath: string): void => {
  initializeDirectory(rootPath);

  Object.values(DIRECTORIES).forEach((dirname: string) => {
    initializeDirectory(path.join(rootPath, dirname));
  });
}