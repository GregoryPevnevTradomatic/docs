import textract from 'textract';
import { DOCX_MIME_TYPE } from '../../constants';

const VARIABLES_PATTERN = /\{[^\}]+\}/ig; // eslint-disable-line no-useless-escape

const extractParameter = (variable: string): string =>
  variable.slice(1, variable.length - 1);

const extractParameters = (text: string): string[] => {
  const matches = text.match(VARIABLES_PATTERN);

  if(!matches) return [];

  // TODO: Checking ordering

  return matches.map(extractParameter);
};

export const ParseFile = () => async (data: Buffer): Promise<string[]> =>
  new Promise((res, rej) => {
    textract.fromBufferWithMime(DOCX_MIME_TYPE, data, (err: Error, text: string) => {
      if(err) return rej(err);

      return res(extractParameters(text));
    });
  });

export const ParseText = () => async (text: string): Promise<string[]> =>
  extractParameters(text);
