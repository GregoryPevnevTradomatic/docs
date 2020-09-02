import { Readable } from 'stream';

// TODO: Integrate with File-Types / File-Data (Direct conversion)

export const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  const chunks = [];

  for await (const chunk of stream)chunks.push(chunk);

  return Buffer.concat(chunks);
};

export const bufferToStream = async(buffer: Buffer): Promise<NodeJS.ReadableStream> => {
  const readableInstanceStream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });

  return readableInstanceStream;
};
