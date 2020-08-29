import { Document, DocumentParameters, DocumentStatus, DocumentFileType } from '../../models';

export interface LoadDocument {
  (docId: number): Promise<Document>;
}

export interface CreateDocument {
  (userId: string, parameter: DocumentParameters): Promise<Document>;
}

export interface UpdateDocumentParameters {
  (document: Document, parameter: DocumentParameters): Promise<Document>;
}

export interface UpdateDocumentStatus {
  (document: Document, status: DocumentStatus): Promise<Document>;
}

export interface AddFileToDocument {
  (document: Document, fileName: string, fileType: DocumentFileType): Promise<Document>;
}

export interface DocumentRepository {
  loadDocument: LoadDocument;
  createDocument: CreateDocument;
  updateDocumentParameters: UpdateDocumentParameters;
  updateDocumentStatus: UpdateDocumentStatus;
  addFile: AddFileToDocument;
}
