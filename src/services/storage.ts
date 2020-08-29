import { DocumentFile } from '../models';

// Using a combination of File-Id and File-Type
//  -> Using an appropriate Bucket / Directory

export interface SaveFile {
  (file: DocumentFile): Promise<void>;
}

export interface LoadFile {
  (file: DocumentFile): Promise<Buffer>;
}

export interface RemoveFile {
  (file: DocumentFile): Promise<void>;
}

export interface StorageService {
  saveFile: SaveFile;
  loadFile: LoadFile;
  removeFile: RemoveFile;
}
