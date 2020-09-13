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
import { inputChoicesButtons, ParameterInputSelectionText } from '../../common/messages';
import { Api } from '../../../api';

export const createParameterChoiceHandler = (_: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    const currentMode: ParameterInputMode = ParameterInputModesText[ctx.message.text];

    ctx.session.input.mode = currentMode;
    ctx.session.state = UserState.ENTERING_PARAMETERS;

    switch(currentMode) {
      case ParameterInputMode.AllAtOnce:
        return ctx.reply(listOptions(ctx.session.input));
      case ParameterInputMode.OneByOne:
        return ctx.reply(currentOption(ctx.session.input));
      default:
        return ctx.reply(ParameterInputSelectionText, inputChoicesButtons());
    }
  };
