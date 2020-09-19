import https from 'https';
import { streamToBuffer } from './conversions';

export const downloadBufferFromURL = (url: string): Promise<Buffer> =>
  new Promise((res) => {
    https.get(url, async stream => {
      const buffer = await streamToBuffer(stream);
  
      return res(buffer);
    });
  });

export const downloadStreamFromURL = (url: string): Promise<NodeJS.ReadableStream> =>
  new Promise((res) => {
    https.get(url, response => res(response));
  });
