import TelegramApiClient from 'node-telegram-bot-api';
import https from 'https';
import { TelegramFile } from '../common';
import { DocumentFile, DocumentFileType } from '../../models';
import { extractData, FileData, fileDataFromStream } from '../../utilities';

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

export const DownloadFileFromTelegram = (telegramClient: TelegramApiClient) =>
  async (file: TelegramFile): Promise<FileData> => {
    const url: string = await telegramClient.getFileLink(file.file_id);

    return new Promise(resolve => 
      https.get(url, stream => resolve(fileDataFromStream(stream)))
    );
  };

export const UploadFileToTelegram = (telegramClient: TelegramApiClient) =>
  async (chatId: number, file: DocumentFile): Promise<void> => {
    await telegramClient.sendDocument(
      chatId,
      extractData(file.fileData),
      {},
      metadataFor(file),
    );
  };
