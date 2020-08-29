import { Middleware, Extra, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { TelegramClient } from '../../client';
import {
  TelegramFile,
  UserState,
  ContextWithSession,
  NextFunction,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS
} from '../../common';
import { Api } from '../../../api';
import { inputChoicesButtons, clearKeyboard } from '../../common/messages';

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

      if (photo)
        return ctx.reply('Images and photoes are not supported');

      if (file) {
        if(!isValidFile(file)) return ctx.reply('Invalid file (Only DOCX files are supported)');

        const data: Buffer = await telegramClient.downloadFile(file);

        // TODO:  Starting a new template
        // TODO:  Send error in case of processing going wrong

        fs.writeFileSync(path.resolve(__dirname, '..', '..', '..', '..', 'files', `${Date.now()}.docx`), data);

        ctx.session.document = {
          docId: 1,
          userId: "2",
          status: null,
          parameters: { 'P1': null, 'P2': null, "P3": null },
          template: null,
          result: null,
        }; 
        ctx.session.input = null;
        ctx.session.state = UserState.TEMPLATE_UPLOADED;

        return ctx.reply('Select Parameter-Entering Mode', inputChoicesButtons());
      }

      return ctx.reply('Send me a template', clearKeyboard());
    };

    return templateHandler;
}
