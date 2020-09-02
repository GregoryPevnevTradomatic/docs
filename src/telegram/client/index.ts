import TelegramApiClient from 'node-telegram-bot-api';
import { TelegramFile } from '../common';
import { FileData } from '../../utilities';
import { DocumentFile } from '../../models';
import { DownloadFileFromTelegram, UploadFileToTelegram } from './files';
import { Progress, ProgressControls } from './progress';

export interface TelegramClient {
  downloadFile(file: TelegramFile): Promise<FileData>;
  uploadFile(chatId: number, file: DocumentFile): Promise<void>;
  progress(chatId: number, messages: string[], interval?: number): Promise<ProgressControls>;
}

export const createTelegramClient = (telegramToken: string): TelegramClient => {
  const telegramClient = new TelegramApiClient(telegramToken, { polling: false });

  return {
    downloadFile: DownloadFileFromTelegram(telegramClient),
    uploadFile: UploadFileToTelegram(telegramClient),
    progress: Progress(telegramClient),
  }
};
