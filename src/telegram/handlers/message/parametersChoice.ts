import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParameterInputMode,
  UserState,
  listOptions,
  currentOption,
  ParameterInputModesText,
} from '../../common';
import { Api } from '../../../api';
import { inputChoicesButtons } from '../../common/messages';

export const createParameterChoiceHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    const currentMode: ParameterInputMode = ParameterInputModesText[ctx.message.text];

    ctx.session.state = UserState.ENTERING_PARAMETERS;
    ctx.session.input = {
      mode: currentMode,
      // TODO: Move to Helper / Parameters / Model
      parameters: Object.keys(ctx.session.document.parameters).sort(),
      values: [],
    };

    switch(currentMode) {
      case ParameterInputMode.AllAtOnce:
        return ctx.reply(listOptions(ctx.session.input));
      case ParameterInputMode.OneByOne:
        return ctx.reply(currentOption(ctx.session.input));
      default:
        return ctx.reply('Select Parameter-Entering Mode', inputChoicesButtons());
    }
  };
