// TODO: Using various types for transfering files
// TODO: Using an ADT / Subclasses
// TODO: Integrate with Storage and Telegram directly?
export type FileData = { data: Buffer } |
  { stream: NodeJS.ReadableStream } |
  { url: string } |
  { filepath: string };