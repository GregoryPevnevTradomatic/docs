import TelegramApiClient from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from './common';
import { extractData, FileData, fileDataFromStream } from '../utilities';
import { DocumentFile, DocumentFileType } from '../models';

const DEFAULT_MIME_TYPE = 'application/octet-stream';

const MimeFileTypes = {
  [DocumentFileType.Template]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [DocumentFileType.Result]: 'application/pdf',
};

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<FileData>;
  uploadFile(chatId: number, file: DocumentFile): Promise<void>;
}

interface FileMetadata {
  filename: string;
  contentType: string;
}

const metadataFor = (file: DocumentFile): FileMetadata =>
  ({
    filename: file.fileName,
    // TODO: Switch between Templates (PDF) and Results (DOCX)
    // contentType: MimeFileTypes[file.fileType] || DEFAULT_MIME_TYPE,
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });

const DownloadFileFromTelegram = (telegramClient: TelegramApiClient) =>
  async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, stream => resolve(fileDataFromStream(stream)))
    );
  };

const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, file: DocumentFile): Promise<void> => {
    await telegramClient.sendDocument(
      chatId,
      extractData(file.fileData),
      {},
      metadataFor(file),
    );
  };

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramApiClient(telegramToken, { polling: false });

  return {
    downloadFile: DownloadFileFromTelegram(telegramClient),
    uploadFile: UploadFileToTelegram(telegramClient),
  }
};
