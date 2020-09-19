import { Middleware } from 'telegraf';
import path from 'path';
import { TelegramClient } from '../../client';
import {
  UserState,
  TelegramFile,
  ContextWithSession,
  NextFunction,
  DefaultMessage,
  ClearKeyboard,
  DownloadSteps,
  resetSession,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
  NoParametersMessage,
  InputKeyboard,
  ParameterInputMessage,
  parametersInputFromDocument,
  TemplateInfoMessage,
  ParameterInputInProcessMessage
} from '../../common';
import { Api } from '../../../api';
import { Document, isParametersListEmpty } from '../../../models';
import { FileData } from '../../../utilities';

const isValidFile = (file: TelegramFile): boolean => {
  if(file.mime_type && SUPPORTED_MIME_TYPES.includes(file.mime_type)) return true;
  if(file.file_name && SUPPORTED_EXTENSIONS.includes(path.extname(file.file_name))) return true;

  return false;
};

export const createTemplateUploadHandler = (api: Api) =>
  (telegramClient: TelegramClient): Middleware<ContextWithSession> => {
    const photoHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      return ctx.reply(DefaultMessage());
    };

    const fileHandler = async (ctx: ContextWithSession, _: NextFunction) => {
      const file: TelegramFile = ctx.message?.document;

      if(!isValidFile(file))
        return ctx.reply(DefaultMessage());

      const progressControl = await telegramClient.progress(
        ctx.message.chat.id,
        DownloadSteps,
        3000,
      );

      await progressControl.start();

      const data: FileData = await telegramClient.downloadFile(file);

      const document: Document = await api.documents.initializeDocument({
        userId: ctx.session.user.userId,
        templateFilename: file.file_name || `${Date.now()}.docx`, // TODO: Helper (Default name)
        templateData: data,
      });

      await progressControl.finish();

      // No parameters found
      if(isParametersListEmpty(document.parameters)) {
        await api.documents.abortDocument(document);

        return resetSession(ctx).reply(NoParametersMessage(), ClearKeyboard());
      }

      ctx.session.state = UserState.PARAMETERS_INPUT;
      ctx.session.document = document;
      ctx.session.input = parametersInputFromDocument(document);

      await ctx.reply(TemplateInfoMessage(ctx.session.input));

      return ctx.reply(
        ParameterInputMessage(ctx.session.input),
        InputKeyboard(ctx.session.input),
      );
    };

    const templateHandler = async (ctx: ContextWithSession, next: NextFunction) => {
      if(ctx.session.document)
        return ctx.reply(ParameterInputInProcessMessage());

      if (ctx.message?.photo)
        return photoHandler(ctx, next);

      if (ctx.message?.document)
        return fileHandler(ctx, next);

      return ctx.reply(DefaultMessage(), ClearKeyboard());
    };

    return templateHandler;
  };
