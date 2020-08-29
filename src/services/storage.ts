import { DocumentFile } from '../models';
import { FileData } from '../internals';

// Using a combination of File-Id and File-Type
//  -> Using an appropriate Bucket / Directory

export interface SaveFile {
  (file: DocumentFile, data: FileData): Promise<void>;
}

export interface LoadFile {
  (file: DocumentFile): Promise<FileData>;
}

export interface RemoveFile {
  (file: DocumentFile): Promise<void>;
}

export interface StorageService {
  saveFile: SaveFile;
  loadFile: LoadFile;
  removeFile: RemoveFile;
}
