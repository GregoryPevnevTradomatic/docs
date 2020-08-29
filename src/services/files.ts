export interface SaveFile {
  (data: Buffer, name: string): Promise<void>;
}

export interface LoadFile {
  (name: string): Promise<Buffer>;
}

export interface RemoveFile {
  (name: string): Promise<void>;
}

export interface FilesService {
  saveFile: SaveFile;
  loadFile: LoadFile;
  removeFile: RemoveFile;
}
