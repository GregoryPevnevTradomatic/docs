import { Middleware } from 'telegraf';
import path from 'path';
import { TelegramClient } from '../../client';
import {
  TelegramFile,
  ContextWithSession,
  NextFunction,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS
} from '../../common';
import { Api } from '../../../api';
import { inputChoicesButtons, clearKeyboard } from '../../common/messages';
import { Document } from '../../../models';
import { FileData } from '../../../utilities';

const isValidFile = (file: TelegramFile): boolean => {
  if(file.mime_type && SUPPORTED_MIME_TYPES.includes(file.mime_type)) return true;
  if(file.file_name && SUPPORTED_EXTENSIONS.includes(path.extname(file.file_name))) return true;

  return false;
};

export const createTemplateUploadHandler = (api: Api) =>
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const templateHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const photo: unknown = ctx.message?.photo;
      const file: TelegramFile = ctx.message?.document;
      const currentDocument: Document = ctx.session.document;

      if (photo)
        return ctx.reply('Images and photoes are not supported');

      if (file) {
        if(!isValidFile(file)) return ctx.reply('Invalid file (Only DOCX files are supported)');

        if(currentDocument) {
          await api.documents.abortDocument(currentDocument);
        }

        const data: FileData = await telegramClient.downloadFile(file);

        ctx.session.document = await api.documents.initializeDocument({
          userId: ctx.session.user.userId,
          templateFilename: file.file_name || `${Date.now()}.docx`,
          templateData: data,
        });

        return ctx.reply('Select Parameter-Entering Mode', inputChoicesButtons());
      }

      return ctx.reply('Send me a template', clearKeyboard());
    };

    return templateHandler;
}
