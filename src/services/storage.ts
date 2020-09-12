import { DocumentFile } from '../models';

// Using a combination of File-Id and File-Type
//  -> Using an appropriate Bucket / Directory

export interface SaveFile {
  (file: DocumentFile): Promise<void>;
}

export interface LoadFile {
  (file: DocumentFile): Promise<void>;
}

export interface ShareURL {
  (file: DocumentFile): Promise<void>;
}

export interface Storage {
  saveFile: SaveFile;
  loadFile: LoadFile;
  shareURL: ShareURL;
}
