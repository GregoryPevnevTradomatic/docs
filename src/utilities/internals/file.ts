export enum FileDataType {
  Buffer = 'buffer',
  Stream = 'stream',
  Filepath = 'filepath',
  URL = 'url',
}

export type BufferFileData = {
  type: FileDataType.Buffer,
  buffer: Buffer,
};

export type StreamFileData = {
  type: FileDataType.Stream,
  stream: NodeJS.ReadableStream,
};

export type FilepathFileData = {
  type: FileDataType.Filepath,
  filepath: string,
};

export type URLFileData = {
  type: FileDataType.URL,
  url: string,
};

export type FileData = BufferFileData |
  StreamFileData |
  FilepathFileData |
  URLFileData;

export const fileDataFromBuffer = (buffer: Buffer): FileData =>
  ({
    type: FileDataType.Buffer,
    buffer,
  });

export const fileDataFromStream = (stream: NodeJS.ReadableStream): FileData =>
  ({
    type: FileDataType.Stream,
    stream,
  });

export const fileDataFromFilepath = (filepath: string): FileData =>
  ({
    type: FileDataType.Filepath,
    filepath,
  });

export const fileDataFromURL = (url: string): FileData =>
  ({
    type: FileDataType.URL,
    url,
  });

export const extractData = (fileData: FileData): Buffer | NodeJS.ReadableStream | string => {
  switch(fileData.type) {
    case FileDataType.Filepath:
        return fileData.filepath;
      case FileDataType.Buffer:
        return fileData.buffer;
      case FileDataType.Stream:
        return fileData.stream;
      default:
        return fileData.url;
  }
};
