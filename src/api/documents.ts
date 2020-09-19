import {
  Document,
  DocumentFile,
  DocumentParameters,
  DocumentStatus,
  templateFile,
} from '../models';
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
  processDocument(document: Document, parameters: DocumentParameters): Promise<DocumentFile>;
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
    try {
      const file: DocumentFile = templateFile(templateFilename, templateData);

      await services.storage.saveFile(file);

      const parameters: DocumentParameters = await services.templates.parseTemplate(file)

      const document: Document = await services.documentRepository.createDocument(
        userId,
        DocumentStatus.InProgress,
        parameters,
      );

      await services.documentRepository.addFile(document, file);

      document.template = file;
      
      return document;
    } catch (e) {
      throw new Error(e);
    }
  };

const AbortDocument = (services: Services) =>
  (document: Document): Promise<void> => {
    document.status = DocumentStatus.Aborted;

    return services.documentRepository.updateDocument(document);
  };

const ProcessDocument = (services: Services) =>
  async (document: Document, parameters: DocumentParameters): Promise<DocumentFile> => {
    await services.storage.loadFile(document.template);

    // Note: Updating document-record in multiple steps? (Parameters -> File -> Completion)
    document.parameters = parameters;
    document.status = DocumentStatus.Completed;

    const result = await services.templates.processTemplate(
      document.template,
      document.parameters,
    );

    document.result = result;

    await services.storage.saveFile(document.result);

    await Promise.all([
      // Creating File-Record
      services.documentRepository.addFile(document, result),
      // Updating Document-Record
      services.documentRepository.updateDocument(document),
    ]);

    await services.storage.loadFile(document.result);

    return result;
  };

export const createDocumentApi = (services: Services): DocumentApi => ({
  loadDocument: LoadDocument(services),
  loadCurrentDocument: LoadCurrentDocument(services),
  initializeDocument: InitializeDocument(services),
  abortDocument: AbortDocument(services),
  processDocument: ProcessDocument(services),
});
