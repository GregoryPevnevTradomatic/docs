import { DocumentFile, DocumentParameters } from '../models';
import { Templates, ParseTemplate, ProcessTemplate } from '../services';
import { DocumentTemplateConverter, createConverter } from './converter';
import { DocumentTemplateProcessor, createTempateProcessor } from './processor';

interface DocumentTemplatesSettings {
  cloudConvertKey: string;
  // TODO: More settings
}

interface DocumentTemplatesServices {
  converter: DocumentTemplateConverter;
  processor: DocumentTemplateProcessor;
}

const ParseDocumentTemplate = (services: DocumentTemplatesServices): ParseTemplate =>
  async (document: DocumentFile): Promise<DocumentParameters> => {
    return null;
  };

const ProcessDocumentTemplate = (services: DocumentTemplatesServices): ProcessTemplate =>
  async (document: DocumentFile, parameters: DocumentParameters): Promise<DocumentFile> => {
    return null;
  };

export const createDocumentTemplatesService = (settings: DocumentTemplatesSettings): Templates => {
  const converter: DocumentTemplateConverter = createConverter(settings.cloudConvertKey);
  const processor: DocumentTemplateProcessor = createTempateProcessor();
  const services: DocumentTemplatesServices = { converter, processor };

  return {
    parseTemplate: ParseDocumentTemplate(services),
    processTemplate: ProcessDocumentTemplate(services),
  }
};
