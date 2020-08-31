import {
  Document,
  DocumentStatus,
  DocumentParameters,
  DocumentFile
} from '../../models';

export interface LoadDocument {
  (docId: number): Promise<Document>;
}
export interface LoadCurrentDocument {
  (userId: string): Promise<Document>;
}

export interface CreateDocument {
  (userId: string, status: DocumentStatus, parameter: DocumentParameters): Promise<Document>;
}

export interface UpdateDocument {
  (document: Document): Promise<void>;
}

export interface AddFileToDocument {
  (document: Document, file: DocumentFile): Promise<void>;
}

export interface DocumentRepository {
  loadDocument: LoadDocument;
  loadCurrentDocument: LoadCurrentDocument;
  createDocument: CreateDocument;
  updateDocument: UpdateDocument;
  addFile: AddFileToDocument;
}
