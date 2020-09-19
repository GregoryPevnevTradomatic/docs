import { DEFAULT_TEMPLATE_FILENAME, TEMPLATE_EXTENSION } from '../../constants';

export const transferStream = (from: NodeJS.ReadableStream, to: NodeJS.WritableStream): Promise<void> =>
  new Promise((res, rej) => {
    from.pipe(to)
      .on('finish', () => res())
      .on('error',rej);
  });

export const newFilename = (): string =>
  `${DEFAULT_TEMPLATE_FILENAME}-${Date.now()}${TEMPLATE_EXTENSION}`;
