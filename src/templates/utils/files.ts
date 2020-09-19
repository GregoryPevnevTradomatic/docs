import { DEFAULT_RESULT_FILENAME, RESULT_EXTENSION } from '../../constants';

const FILENAME_PATTERN = /^([^.]+)\.?.*$/;

const clearFilename = (filename: string): string =>
  filename.replace(/\s+/g, ' ') // No duplicate whitespace
    .replace(/\s/g, '_') // Get rid of whitespace
    .replace(/\//g, '_'); // Formatting filename

const withExtension = (filename: string, extension: string): string => {
  const match = filename.match(FILENAME_PATTERN);

  const name = match.length > 1 ? match[1] : DEFAULT_RESULT_FILENAME;

  return `${name}.${extension}`;
};

export const prepareFilename = (filename: string): string =>
  withExtension(clearFilename(filename), RESULT_EXTENSION);
