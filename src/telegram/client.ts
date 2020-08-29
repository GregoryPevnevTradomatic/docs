import TelegramDocumentBotApi from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from './common';
import { streamToBuffer } from '../internals';

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<Buffer>;
}

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramDocumentBotApi(telegramToken, { polling: false });

  const downloadFileFromTelegram = async (file: TelegramFile): Promise<Buffer> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, result => resolve(streamToBuffer(result)))
    );
  };

  return {
    downloadFile: downloadFileFromTelegram,
  }
};
