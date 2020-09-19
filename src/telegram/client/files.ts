import TelegramApiClient from 'node-telegram-bot-api';
import { TelegramFile } from '../common';
import { DocumentFile, DocumentFileType } from '../../models';
import { downloadBufferFromURL, FileData, fileDataFromBuffer, FileDataType } from '../../utilities';

const DEFAULT_MIME_TYPE = 'application/octet-stream';

const MimeFileTypes = {
  [DocumentFileType.Template]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [DocumentFileType.Result]: 'application/pdf',
};

interface FileMetadata {
  filename: string;
  contentType: string;
}

const metadataFor = (file: DocumentFile): FileMetadata =>
  ({
    filename: file.fileName,
    contentType: MimeFileTypes[file.fileType] || DEFAULT_MIME_TYPE,
  });

const prepareStream = (stream: NodeJS.ReadableStream): NodeJS.ReadableStream => {
  // SUPER-DIRTY BUT NECESSARY FOR TELEGRAM TO SEND A STREAM
  /* eslint-disable-next-line */
  // @ts-ignore
  stream.path = 'файл.pdf'; 

  return stream;
};

export const DownloadFileFromTelegram = (telegramClient: TelegramApiClient) =>
  async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);
    const buffer: Buffer = await downloadBufferFromURL(url);

    return fileDataFromBuffer(buffer);
  };

export const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, file: DocumentFile): Promise<void> => {
    const metadata = metadataFor(file);

    switch(file.fileData.type) {
      case FileDataType.Buffer:
        await telegramClient.sendDocument(chatId, file.fileData.buffer, {}, metadata);
        break;
      case FileDataType.Filepath:
        await telegramClient.sendDocument(chatId, file.fileData.filepath, {}, metadata);
        break;
      case FileDataType.URL:
        await telegramClient.sendDocument(chatId, file.fileData.url, {}, metadata);
        break;
      case FileDataType.Stream:
      default:
        await telegramClient.sendDocument(
          chatId,
          prepareStream(file.fileData.stream),
          {},
          metadataFor(file),
        );
        break;
    }

    if(file.fileData.type === 'stream') {
      await telegramClient.sendDocument(
        chatId,
        prepareStream(file.fileData.stream),
        {},
        metadataFor(file),
      ); 
    }
  };
