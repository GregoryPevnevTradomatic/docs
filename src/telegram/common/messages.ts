import { Extra } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { ParametersInput, ParameterInputMode } from './models';

export const ParameterInputModesText = {
  'По-одному': ParameterInputMode.OneByOne,
  'Все сразу': ParameterInputMode.AllAtOnce,
};

export const BackCommand = 'Назад';

export const DefaultErrorMessageText = 'Что-то пошло не так';
export const PhotoUploadErrorText = 'Картинки и фотографии не поддержуются';
export const InvalidDocumentTypeText = 'Тип файла не подерживается (Только DOCX)';
export const ParameterInputErrorText = 'Неверное количество параметров, попробуйте еще раз';

export const DefaultMessageText = 'Пришлите документ для обработки';
export const NextMessageText = 'Пришлите новый документ для обработки';
export const ParameterInputSelectionText = 'Как бы вы хотели ввести параметры?';
export const WaitingText = 'Пожалуйста подождите...';
export const UnknownCommandText = 'Неизвестная операция, попробуйте еще';

export const DownloadSteps = [
  'Файл скачивается',
  'Сканирование',
];
export const ProcessingSteps = [
  'Обработка шаблона',
  'Создается PDF',
  'Файл отсылается',
];

export const inputChoicesButtons = (): ExtraEditMessage =>
  Extra.markup(markup =>
    markup.keyboard(
      Object.keys(ParameterInputModesText),
      { wrap: () => false }
    ).resize().oneTime(true)
  );

export const abortButton = (): ExtraEditMessage =>
  Extra.markup(markup =>
    markup.keyboard([BackCommand])
      .resize().oneTime(true)
  );

export const clearKeyboard = (): ExtraEditMessage =>
    Extra.markup(markup => markup.removeKeyboard().resize());

export const listOptions = ({ parameters }: ParametersInput): string =>
  `Введите параметры в следующем порядке:\n${parameters.join(', ')}`;

export const currentOption = ({ parameters, values }: ParametersInput): string =>
  `Введите "${parameters[values.length]}":`;
