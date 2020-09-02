import https from 'https';
import fs from 'fs';
import util from 'util';
import { DocumentFile, DocumentParameters, emptyParameters, resultFile } from '../models';
import { Templates, ParseTemplate, ProcessTemplate } from '../services';
import { bufferToStream, FileData, fileDataFromStream, FileDataType, streamToBuffer } from '../utilities';
import { DocumentTemplateConverter, createConverter } from './converter';
import { DocumentTemplateProcessor, createTempateProcessor } from './processor';

// TODO: Split into a separate file

// TODO: Reusing via Common Utility
const loadBuffer = util.promisify(fs.readFile);

interface DocumentTemplatesSettings {
  cloudConvertKey: string;
  // TODO: More settings
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
      // TODO: Reusing the same thing from telegram -> "http" module in "utilities"
      return new Promise((res) => {
        https.get(file.url, response => res(streamToBuffer(response)));
      });
  }
};

const ParseDocumentTemplate = ({ processor }: DocumentTemplatesServices): ParseTemplate =>
  async (file: DocumentFile): Promise<DocumentParameters> => {
    const [filenameParams, fileParams] = await Promise.all([
      processor.parseText(file.fileName),
      bufferFrom(file.fileData).then(processor.parseFile),
    ]);

    return {
      ...emptyParameters(filenameParams),
      ...emptyParameters(fileParams),
    };
  };

const ProcessDocumentTemplate = ({ processor, converter }: DocumentTemplatesServices): ProcessTemplate =>
  async (file: DocumentFile, parameters: DocumentParameters): Promise<DocumentFile> => {
    const [resultDocumentFile, resultFilename] = await Promise.all([
      bufferFrom(file.fileData).then(buffer => processor.renderFile(buffer, parameters)),
      processor.renderText(file.fileName, parameters),
    ]);

    // TODO: URL (When utilizing Bucket-Upload)
    const resultConvertedFile = await bufferToStream(resultDocumentFile)
      .then(converter.convertDocxToPdf);

    return resultFile(resultFilename, fileDataFromStream(resultConvertedFile));
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
