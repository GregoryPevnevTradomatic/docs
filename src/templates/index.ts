import { DocumentFile, DocumentParameters, initializeParameters, resultFile } from '../models';
import { Templates, ParseTemplate, ProcessTemplate } from '../services';
import { bufferToStream, loadBuffer, FileData, fileDataFromBuffer, FileDataType, streamToBuffer, downloadBufferFromURL } from '../utilities';
import { DocumentTemplateConverter, createConverter } from './converter';
import { DocumentTemplateProcessor, createTempateProcessor } from './processor';
import { prepareFilename } from './utils';

interface DocumentTemplatesSettings {
  cloudConvertKey: string;
}

interface DocumentTemplatesServices {
  converter: DocumentTemplateConverter;
  processor: DocumentTemplateProcessor;
}

const bufferFrom = async (file: FileData): Promise<Buffer> => {
  switch(file.type) {
    case FileDataType.Buffer:
      return file.buffer;
    case FileDataType.Stream:
      return streamToBuffer(file.stream);
    case FileDataType.Filepath:
      return loadBuffer(file.filepath);
    case FileDataType.URL:
    default:
      return downloadBufferFromURL(file.url);
  }
};

const ParseDocumentTemplate = ({ processor }: DocumentTemplatesServices): ParseTemplate =>
  async (file: DocumentFile): Promise<DocumentParameters> => {
    const [filenameParams, fileParams] = await Promise.all([
      processor.parseText(file.fileName),
      bufferFrom(file.fileData).then(processor.parseFile),
    ]);

    // Ordering: Filename parameters go first
    return initializeParameters([
      ...filenameParams,
      ...fileParams,
    ]);
  };

const ProcessDocumentTemplate = ({ processor, converter }: DocumentTemplatesServices): ProcessTemplate =>
  async (file: DocumentFile, parameters: DocumentParameters): Promise<DocumentFile> => {
    const [resultDocumentFile, resultFilename] = await Promise.all([
      bufferFrom(file.fileData).then(buffer => processor.renderFile(buffer, parameters)),
      processor.renderText(file.fileName, parameters),
    ]);

    const resultConvertedFile = await bufferToStream(resultDocumentFile)
      .then(converter.convertDocxToPdf)
      .then(streamToBuffer);

    return resultFile(
      prepareFilename(resultFilename),
      fileDataFromBuffer(resultConvertedFile),
    );
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
