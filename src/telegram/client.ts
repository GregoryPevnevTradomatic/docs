import TelegramApiClient from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from './common';
import { extractData, FileData, fileDataFromStream } from '../utilities';
import { DocumentFile, DocumentFileType } from '../models';

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<FileData>;
  uploadFile(chatId: number, file: DocumentFile): Promise<void>;
}

const DownloadFileFromTelegram = (telegramClient: TelegramApiClient) =>
  async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, stream => resolve(fileDataFromStream(stream)))
    );
  };

const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, file: DocumentFile): Promise<void> => {
    // TODO: Helper + Interface
    const metadata = {
      filename: file.fileName,
      // TODO: Switch between Templates (PDF) and Results (DOCX)
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    await telegramClient.sendDocument(chatId, extractData(file.fileData), {}, metadata);
  };

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramApiClient(telegramToken, { polling: false });

  return {
    downloadFile: DownloadFileFromTelegram(telegramClient),
    uploadFile: UploadFileToTelegram(telegramClient),
  }
};
