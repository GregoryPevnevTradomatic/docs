import { Middleware } from 'telegraf';
import {
  ContextWithSession,
  NextFunction,
  ParameterInputMode,
  UserState,
  listOptions,
  currentOption,
  ParameterInputModesText,
  abortButton,
} from '../../common';
import { Api } from '../../../api';

export const createParameterChoiceHandler = (api: Api): Middleware<ContextWithSession> =>
  async (ctx: ContextWithSession, _: NextFunction) => {
    const currentMode: ParameterInputMode = ParameterInputModesText[ctx.message.text];

    ctx.session.state = UserState.ENTERING_PARAMETERS;
    ctx.session.input = {
      mode: currentMode,
      parameters: Object.keys(ctx.session.document.parameters).sort(),
      values: [],
    };

    if(currentMode === ParameterInputMode.AllAtOnce)
      return ctx.reply(listOptions(ctx.session.input));
        
    return ctx.reply(currentOption(ctx.session.input), abortButton());
  };
