export const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  const chunks = [];

  for await (const chunk of stream)chunks.push(chunk);

  return Buffer.concat(chunks);
};