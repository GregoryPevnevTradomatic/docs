import { Middleware } from 'telegraf';
import path from 'path';
import { TelegramClient } from '../../client';
import {
  UserState,
  TelegramFile,
  ContextWithSession,
  NextFunction,
  inputChoicesButtons,
  clearKeyboard,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS
} from '../../common';
import { Api } from '../../../api';
import { Document, DocumentFile, parameterNames } from '../../../models';
import { FileData } from '../../../utilities';

const isValidFile = (file: TelegramFile): boolean => {
  if(file.mime_type && SUPPORTED_MIME_TYPES.includes(file.mime_type)) return true;
  if(file.file_name && SUPPORTED_EXTENSIONS.includes(path.extname(file.file_name))) return true;

  return false;
};

export const createTemplateUploadHandler = (api: Api) =>
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const photoHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      return ctx.reply('Images and photoes are not supported');
    };

    const fileHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const file: TelegramFile = ctx.message?.document;
      const currentDocument: Document = ctx.session.document;

      if(!isValidFile(file))
        return ctx.reply('Invalid file (Only DOCX files are supported)');

      if(currentDocument) {
        await api.documents.abortDocument(currentDocument);
      }

      const data: FileData = await telegramClient.downloadFile(file);

      const document: Document = await api.documents.initializeDocument({
        userId: ctx.session.user.userId,
        templateFilename: file.file_name || `${Date.now()}.docx`,
        templateData: data,
      });
      const parameters: string[] = parameterNames(document);

      // No parameters found
      if(parameters.length === 0) {
        const progressControl = await telegramClient.progress(
          ctx.message.chat.id,
          ['Loading file', 'Converting to PDF', 'Sending it to you'],
          5000,
        );

        await progressControl.start();

        const result: DocumentFile = await api.documents.processDocument(document, {});

        await progressControl.finish();
  
        // TODO: Function for resetting
        ctx.session.state = UserState.INITIAL;
    
        return telegramClient.uploadFile(ctx.message.chat.id, result);
      }

      ctx.session.state = UserState.TEMPLATE_UPLOADED;
      ctx.session.document = document;

      return ctx.reply('Select Parameter-Entering Mode', inputChoicesButtons());
    };

    const templateHandler = async (ctx: ContextWithSession, next: NextFunction) => {
      if (ctx.message?.photo)
        return photoHandler(ctx, next);

      if (ctx.message?.document)
        return fileHandler(ctx, next);

      return ctx.reply('Send me a template', clearKeyboard());
    };

    return templateHandler;
  };
