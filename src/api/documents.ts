import { Document } from '../models';
import { Services } from '../services';
import { FileData } from '../utilities';

export interface DocumentData {
  userId: string;
  templateFilename: string;
  templateData: FileData;
}

export interface DocumentApi {
  loadDocument(docId: number): Promise<Document>;
  loadCurrentDocument(userId: string): Promise<Document>;
  initializeDocument(docData: DocumentData): Promise<Document>;
  abortDocument(document: Document): Promise<void>;
  processDocument(document: Document, values: string[]): Promise<FileData>;
}

// Note: Split into separate files if the functions grow too large

const LoadDocument = (services: Services) =>
  (docId: number): Promise<Document> => {
    return null;
  };

const LoadCurrentDocument = (services: Services) =>
  (userId: string): Promise<Document> => {
    return null;
  };

const InitializeDocument = (services: Services) =>
  (docData: DocumentData): Promise<Document> => {
    return null;
  };

const AbortDocument = (services: Services) =>
  (document: Document): Promise<void> => {
    return null;
  };

const ProcessDocument = (services: Services) =>
  (document: Document, values: string[]): Promise<FileData> => {
    return null;
  };

export const createDocumentApi = (services: Services): DocumentApi => ({
  loadDocument: LoadDocument(services),
  loadCurrentDocument: LoadCurrentDocument(services),
  initializeDocument: InitializeDocument(services),
  abortDocument: AbortDocument(services),
  processDocument: ProcessDocument(services),
});
