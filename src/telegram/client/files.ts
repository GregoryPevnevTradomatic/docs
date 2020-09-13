import TelegramApiClient from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from '../common';
import { DocumentFile, DocumentFileType } from '../../models';
import { extractData, FileData, fileDataFromStream, streamToBuffer } from '../../utilities';

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

    return new Promise(resolve => 
      https.get(url, stream => resolve(fileDataFromStream(stream)))
    );
  };

export const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, file: DocumentFile): Promise<void> => {
    console.log('Metadata:', metadataFor(file));

    if(file.fileData.type === 'stream') {
      await telegramClient.sendDocument(
        chatId,
        prepareStream(file.fileData.stream),
        {},
        metadataFor(file),
      ); 
    }
  };
