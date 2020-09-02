export const clearFilename = (filename: string): string =>
  // TODO: Pre-processing filename for Telegram-Attachment
  filename.replace(/\s+/g, ' ') // No duplicate whitespace
    .replace(/\s/g, '_') // Get rid of whitespace
    .replace(/\//g, '_'); // Formatting filename