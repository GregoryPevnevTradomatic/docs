import { DocumentParameters } from '../models';

const underscoreParam = (param: string): string => param.replace(/-/g, '_');
const whitespaceParam = (param: string): string => param.replace(/-/g, ' ');

export const extendParameters = (parameters: DocumentParameters): DocumentParameters =>
  Object.keys(parameters).reduce(
    (result, param) => ({
      ...result,
      [underscoreParam(param)]: parameters[param],
      [whitespaceParam(param)]: parameters[param],
    }),
    parameters
  );

export const clearFilename = (filename: string): string =>
  // TODO: Pre-processing filename for Telegram-Attachment
  filename.replace(/\s+/g, ' ') // No duplicate whitespace
    .replace(/\s/g, '_') // Get rid of whitespace
    .replace(/\//g, '_'); // Formatting filename