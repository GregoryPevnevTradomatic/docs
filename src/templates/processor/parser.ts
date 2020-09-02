import textract from 'textract';

// TODO: Application-Global Constants
const MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const VARIABLES_PATTERN = /\{[^\}]+\}/ig; // eslint-disable-line no-useless-escape

const extractParameter = (variable: string): string =>
  variable.slice(1, variable.length - 1);

const extractParameters = (text: string): string[] =>
  text.match(VARIABLES_PATTERN).map(extractParameter)

export const ParseFile = () => async (data: Buffer): Promise<string[]> =>
  new Promise((res, rej) => {
    textract.fromBufferWithMime(MIME_TYPE, data, (err: Error, text: string) => {
      if(err) return rej(err);

      return res(extractParameters(text));
    });
  });

export const ParseText = () => async (text: string): Promise<string[]> => {
  return extractParameters(text);
};
