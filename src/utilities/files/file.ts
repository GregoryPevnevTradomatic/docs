export type BufferFileData = {
  type: 'buffer',
  data: Buffer,
};

export type StreamFileData = {
  type: 'stream',
  stream: NodeJS.ReadableStream,
};

export type FilepathFileData = {
  type: 'filepath',
  filepath: string,
};

export type URLFileData = {
  type: 'url',
  url: string,
};

export type FileData = BufferFileData |
  StreamFileData |
  FilepathFileData |
  URLFileData;