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
import { initialSessionFor } from '../../common/session';
import { PhotoUploadErrorText, InvalidDocumentTypeText, ProcessingSteps, DownloadSteps, ParameterInputSelectionText, DefaultMessageText, NextMessageText } from '../../common/messages';

const isValidFile = (file: TelegramFile): boolean => {
  if(file.mime_type && SUPPORTED_MIME_TYPES.includes(file.mime_type)) return true;
  if(file.file_name && SUPPORTED_EXTENSIONS.includes(path.extname(file.file_name))) return true;

  return false;
};

export const createTemplateUploadHandler = (api: Api) =>
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const photoHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      return ctx.reply(PhotoUploadErrorText);
    };

    const fileHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const file: TelegramFile = ctx.message?.document;
      const currentDocument: Document = ctx.session.document;

      if(!isValidFile(file))
        return ctx.reply(InvalidDocumentTypeText);

      if(currentDocument) {
        await api.documents.abortDocument(currentDocument);
      }

      const progressControl = await telegramClient.progress(
        ctx.message.chat.id,
        DownloadSteps,
        2000,
      );

      await progressControl.start();

      const data: FileData = await telegramClient.downloadFile(file);

      const document: Document = await api.documents.initializeDocument({
        userId: ctx.session.user.userId,
        templateFilename: file.file_name || `${Date.now()}.docx`,
        templateData: data,
      });

      const parameters: string[] = parameterNames(document.parameters);

      // No parameters found
      if(parameters.length === 0) {
        await progressControl.refresh(ProcessingSteps);

        const result: DocumentFile = await api.documents.processDocument(document, {});

        await progressControl.finish();
  
        ctx.session = initialSessionFor(ctx.session.user);
    
        await telegramClient.uploadFile(ctx.message.chat.id, result);

        return ctx.reply(NextMessageText, clearKeyboard());
      }

      await progressControl.finish();

      ctx.session.state = UserState.TEMPLATE_UPLOADED;
      ctx.session.document = document;
      ctx.session.input = {
        mode: null,
        parameters,
        values: [],
      };

      return ctx.reply(ParameterInputSelectionText, inputChoicesButtons());
    };

    const templateHandler = async (ctx: ContextWithSession, next: NextFunction) => {
      if (ctx.message?.photo)
        return photoHandler(ctx, next);

      if (ctx.message?.document)
        return fileHandler(ctx, next);

      return ctx.reply(DefaultMessageText, clearKeyboard());
    };

    return templateHandler;
  };
