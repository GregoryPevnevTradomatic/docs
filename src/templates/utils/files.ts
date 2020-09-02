const FILENAME_PATTERN = /^([^\.]+)\.?.*$/;

// TODO: Application-Level Globals
const DEFAULT_FILENAME = 'Result';

const RESULT_EXTENSION = 'pdf';

const clearFilename = (filename: string): string =>
  // TODO: Pre-processing filename for Telegram-Attachment
  filename.replace(/\s+/g, ' ') // No duplicate whitespace
    .replace(/\s/g, '_') // Get rid of whitespace
    .replace(/\//g, '_'); // Formatting filename

const withExtension = (filename: string, extension: string): string => {
  const match = filename.match(FILENAME_PATTERN);

  const name = match.length > 1 ? match[1] : DEFAULT_FILENAME;

  return `${name}.${extension}`;
};

export const prepareFilename = (filename: string): string =>
  withExtension(clearFilename(filename), RESULT_EXTENSION);
