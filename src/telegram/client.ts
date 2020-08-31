import TelegramDocumentBotApi from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from './common';
import { FileData } from '../utilities';

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<FileData>;
  uploadFile(chatId: number, data: FileData): Promise<void>;
}

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramDocumentBotApi(telegramToken, { polling: false });

  const downloadFileFromTelegram = async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, stream => resolve({
        type: 'stream',
        stream,
      }))
    );
  };

  const uploadFileToTelegram = async (chatId: number, data: FileData): Promise<void> => {
    if(data.type === 'stream')
      await telegramClient.sendDocument(
        chatId,
        data.stream,
      );
  };

  return {
    downloadFile: downloadFileFromTelegram,
    uploadFile: uploadFileToTelegram,
  }
};
