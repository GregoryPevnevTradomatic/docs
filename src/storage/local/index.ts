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

const initializeDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
};

const initializeDirectories = (rootPath: string) =>
  Object.values(DIRECTORIES).forEach((dirname: string) => {
    initializeDirectory(path.join(rootPath, dirname));
  });

const SaveFileToDisk = ({ storagePath }: LocalStorageSettings): SaveFile =>
  async (file: DocumentFile): Promise<void> => {
    const filepath: string = pathForFile(storagePath, file);

    if(file.fileData === null)
      throw new Error('No data attached to the file');

    switch(file.fileData.type) {
      case FileDataType.Buffer:
        await saveBuffer(filepath, file.fileData.buffer);

        break;
      // TODO: Remove??? / Simplify / Optimize
      case FileDataType.Stream:
        // Sinking / Dumping ENTIRE stream into Destinoation
        await saveStream(filepath, file.fileData.stream);

        // Opening new stream to produce data for the Upload / Further operations
        file.fileData = fileDataFromStream(fs.createReadStream(filepath));

        break;
      default:
        throw new Error(`Could not save file with the following data: ${String(file.fileData.type)}`);
    }
  };

const LoadFileFromDisk = ({ storagePath, readMode }: LocalStorageSettings): LoadFile => {
  const loadDataForFile = async (filepath: string): Promise<FileData> => {
    switch(readMode) {
      case FileDataType.Filepath:
        return fileDataFromFilepath(filepath);
      case FileDataType.Buffer:
        return loadBuffer(filepath).then(fileDataFromBuffer);
      case FileDataType.Stream:
      default:
        return fileDataFromStream(fs.createReadStream(filepath));
    }
  }

  const loadData: LoadFile = async (file) => {
    const filepath: string = pathForFile(storagePath, file);

    try {
      file.fileData = await loadDataForFile(filepath);
    } catch (e) {
      console.log(`Could not load file-data via path "${filepath}"`);

      file.fileData = null;
    }
  };

  return loadData;
};

export const createLocalStorage = (storagePath: string): Storage => {
  const settings: LocalStorageSettings = {
    storagePath,
    readMode: FileDataType.Stream,
  };

  initializeDirectory(storagePath);
  initializeDirectories(storagePath);

  return {
    saveFile: SaveFileToDisk(settings),
    loadFile: LoadFileFromDisk(settings),
  };
};
