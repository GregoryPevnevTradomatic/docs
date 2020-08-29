import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParametersInput,
  ParameterInputMode,
  UserState,
  currentOption,
  abortButton,
} from '../../common';
import { Api } from '../../../api';
import { parametersFrom } from '../../../models';
import { AbortCommand } from '../../common/constants';
import { clearKeyboard } from '../../common/messages';

// Ask: Is this ACTUALLY helpful???
const extractParametersFromText = (text: string) =>
  text
    .trim()
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .map((param: string) => param.trim())
    .filter((param: string) => param.length !== 0);

const isParametersInputComplete = (input: ParametersInput) =>
  input.parameters.length === input.values.length;

export const createParameterInputHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    const text = ctx.message.text;
    const mode = ctx.session.input.mode;
    const input = ctx.session.input;

    if(mode === ParameterInputMode.AllAtOnce) {
      input.values = extractParametersFromText(ctx.message.text);
    } else {
      if(text === AbortCommand) input.values = [];
      else input.values.push(text);
    }

    if(!isParametersInputComplete(input)) {
      if(mode === ParameterInputMode.AllAtOnce) {
        return ctx.reply('Invalid number of parameters, try again');
      } else {
        return ctx.reply(currentOption(input), abortButton());
      }
    }

    ctx.session.document.parameters = parametersFrom(
      input.parameters,
      input.values,
    );

    console.log('Parameters:', ctx.session.document.parameters);

    ctx.session.state = UserState.INITIAL;
    return ctx.reply('Wait...', clearKeyboard());

    // Supports Buffers / Streams / Filepaths (LOCAL ONLY)
    //  -> Use a different method when sending URL to a file
    // await telegramClient.sendDocument(
    //   ctx.message.chat.id,
    //   path.resolve(__dirname, '..', '..', '..', '..', 'files', 'test.docx'),
    // );
  };
