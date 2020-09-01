import fs from 'fs';
import path from 'path';
import util from 'util';
import {
  Storage,
  SaveFile,
  LoadFile
} from '../../services';
import { DocumentFile, DocumentFileType } from '../../models';
import {
  FileData,
  FileDataType,
  fileDataFromBuffer,
  fileDataFromFilepath,
  fileDataFromStream
} from '../../utilities';

interface LocalStorageSettings {
  storagePath: string;
  // TODO: Reusing the same tags as the FileData -> Separate into constants
  readMode: FileDataType;
}

const DIRECTORIES = {
  [DocumentFileType.Result]: 'results',
  [DocumentFileType.Template]: 'templates',
};

const pathForFile = (storagePath: string, file: DocumentFile): string =>
  path.join(storagePath, DIRECTORIES[file.fileType] || 'other', file.fileId);

const loadBuffer = util.promisify(fs.readFile);
const saveBuffer = util.promisify(fs.writeFile);

const saveStream = (filepath: string, stream: NodeJS.ReadableStream): Promise<void> =>
  new Promise((res, rej) => {
    stream.pipe(fs.createWriteStream(filepath))
      .on('finish', res)
      .on('error', rej)
  });

const SaveFileToDisk = ({ storagePath }: LocalStorageSettings): SaveFile =>
  async (file: DocumentFile, data: FileData): Promise<void> => {
    const filepath: string = pathForFile(storagePath, file);

    switch(data.type) {
      case FileDataType.Buffer:
        await saveBuffer(filepath, data.buffer);
        break;
      case FileDataType.Stream:
        await saveStream(filepath, data.stream);
        break;
      default:
        throw new Error(`Could not save file with teh following data: ${String(data.type)}`);
    }
  };

const LoadFileFromDisk = ({ storagePath, readMode }: LocalStorageSettings): LoadFile =>
  async (file: DocumentFile): Promise<FileData> => {
    const filepath: string = pathForFile(storagePath, file);

    switch(readMode) {
      case FileDataType.Filepath:
        return fileDataFromFilepath(filepath);
      case FileDataType.Buffer:
        return loadBuffer(filepath).then(fileDataFromBuffer);
      case FileDataType.Stream:
      default:
        return fileDataFromStream(fs.createReadStream(filepath));
    }
  };

export const createLocalStorage = (storagePath: string): Storage => {
  const settings: LocalStorageSettings = {
    storagePath,
    readMode: FileDataType.Stream,
  };

  return {
    saveFile: SaveFileToDisk(settings),
    loadFile: LoadFileFromDisk(settings),
  };
};
