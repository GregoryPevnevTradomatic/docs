import CloudConvert from 'cloudconvert';
import { ConvertDocxToPdf } from './cloud-convert';

export interface DocumentTemplateConverter {
  convertDocxToPdf(document:  NodeJS.ReadableStream): Promise< NodeJS.ReadableStream>;
}

export const createConverter = (cloudConvertKey: string): DocumentTemplateConverter => {
  const cloudConvert: CloudConvert = new CloudConvert(cloudConvertKey, false);

  return {
    convertDocxToPdf: ConvertDocxToPdf(cloudConvert)
  };
};
