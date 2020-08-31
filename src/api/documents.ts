import fs from 'fs';
import path from 'path';
import { Document, DocumentFile, DocumentParameters, DocumentStatus, resultFile, templateFile } from '../models';
import { Services } from '../services';
import { FileData } from '../utilities';
import { emptyParameters } from '../models/document';

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
  processDocument(document: Document, parameters: DocumentParameters): Promise<FileData>;
}

// Note: Split into separate files if the functions grow too large

const LoadDocument = (services: Services) =>
  (docId: number): Promise<Document> => {
    return services.documentRepository.loadDocument(docId);
  };

const LoadCurrentDocument = (services: Services) =>
  (userId: string): Promise<Document> => {
    return services.documentRepository.loadCurrentDocument(userId);
  };

const InitializeDocument = (services: Services) =>
  async ({ userId, templateFilename, templateData }: DocumentData): Promise<Document> => {
    const saveStream = () => new Promise(res => {
      if(templateData.type === 'stream') {
        templateData.stream.pipe(
          fs.createWriteStream(
            path.resolve(__dirname, '..', '..', 'files', `${userId}-${templateFilename}`)
          ).on('finish', () => res())
        );
      }
    });

    try {
      // TODO: Parse Document
      const parameters: DocumentParameters = emptyParameters(['P1', 'P2', 'P3']);

      const document: Document = await services.documentRepository.createDocument(
        userId,
        DocumentStatus.InProgress,
        parameters,
      );

      // TODO: Save to storage
      await saveStream();

      const file: DocumentFile = templateFile(templateFilename);

      await services.documentRepository.addFile(document, file);

      document.template = file;
      
      return document;
    } catch (e) {
      // TODO:  Send error in case of processing going wrong
      throw new Error(e);
    }
  };

const AbortDocument = (services: Services) =>
  (document: Document): Promise<void> => {
    document.status = DocumentStatus.Aborted;

    return services.documentRepository.updateDocument(document);
  };

const ProcessDocument = (services: Services) =>
  async (document: Document, parameters: DocumentParameters): Promise<FileData> => {
    const stream = fs.createReadStream(
      path.resolve(__dirname, '..', '..', 'files', `${document.userId}-${document.template.fileName}`)
    );
    const input: FileData = { type: 'stream', stream };

    // TODO: Processing
    const output = input;

    // TODO: Load Result (Get Signed URL / Load from the Disk)
    const result = resultFile('RESULT');

    document.parameters = parameters;
    document.status = DocumentStatus.Completed;
    document.result = result;

    await Promise.all([
      services.documentRepository.addFile(document, result),
      services.documentRepository.updateDocument(document),
    ]);

    return output;
  };

export const createDocumentApi = (services: Services): DocumentApi => ({
  loadDocument: LoadDocument(services),
  loadCurrentDocument: LoadCurrentDocument(services),
  initializeDocument: InitializeDocument(services),
  abortDocument: AbortDocument(services),
  processDocument: ProcessDocument(services),
});
