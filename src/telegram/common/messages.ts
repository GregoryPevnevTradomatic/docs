import { Extra, Markup } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { ParametersInput } from './types';
import { ParameterInputModesText, AbortCommand } from './constants';

export const inputChoicesButtons = (): ExtraEditMessage =>
  Extra.markup(markup =>
    markup.keyboard(
      Object.keys(ParameterInputModesText),
      { wrap: () => false }
    ).resize().oneTime(true)
  );

export const abortButton = (): ExtraEditMessage =>
  Extra.markup(markup =>
    markup.keyboard([AbortCommand]).resize()
  );

export const clearKeyboard = (): ExtraEditMessage =>
    Extra.markup(markup => markup.removeKeyboard().resize());

export const listOptions = ({ parameters }: ParametersInput): string =>
  `Enter parameters in the order as follows:\n${parameters.join(', ')}`;

export const currentOption = ({ parameters, values }: ParametersInput): string =>
  `Enter "${parameters[values.length]}":`;
