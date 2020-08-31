import TelegramApiClient from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from './common';
import { FileData } from '../utilities';

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<FileData>;
  uploadFile(chatId: number, data: FileData): Promise<void>;
}

const DownloadFileFromTelegram = (telegramClient: TelegramApiClient) =>
  async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, stream => resolve({
        type: 'stream',
        stream,
      }))
    );
  };

const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, data: FileData): Promise<void> => {
    if(data.type === 'stream')
      await telegramClient.sendDocument(
        chatId,
        data.stream,
      );
  };

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramApiClient(telegramToken, { polling: false });

  return {
    downloadFile: DownloadFileFromTelegram(telegramClient),
    uploadFile: UploadFileToTelegram(telegramClient),
  }
};
