import { Extra } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { isParametersInputEmpty, ParametersInput } from './models';

// Commands

export const CancelCommand = 'Отмена';
export const BackCommand = 'Назад';

// Messages

const displayParameters = ({ parameters }: ParametersInput): string =>
  parameters.map(param => `"${param}"`).join('\n');

const displayParametersWithValues = ({ parameters, values }: ParametersInput): string =>
  values.slice(0, parameters.length).map((value, index) => `"${parameters[index]}": ${value}`).join('\n');

export const ErrorMessage = (): string =>
'Что-то пошло не так';

export const DefaultMessage = (): string =>
`Пришлите шаблон документа в формате Microsoft Word.\n
Все поля, которые Вы желаете заполнить, заранее замените на {название поля 1}, {название поля 2} и т.д.`;

export const WaitingMessage = (): string =>
'Пожалуйста подождите...';

export const UnknownCommandMessage = (): string =>
'Неизвестная операция, попробуйте еще';

export const TemplateInfoMessage = (input: ParametersInput): string =>
`Шаблон успешно обработан!\n
Мы обнаружили следующие поля для заполнения:
${displayParameters(input)}`;

export const ParametersListMessage = (input: ParametersInput): string =>
`Вы успешно ввели следующие значения:
${displayParametersWithValues(input)}`;

export const ParameterInputMessage = ({ parameters, values }: ParametersInput): string =>
`Введите значение для "${parameters[values.length]}"`;

export const ParameterInputInProcessMessage = (): string =>
`Сперва, закончите пожалуйста заполнение текущего шаблона`;

export const NoParametersMessage = (): string =>
`Данный шаблон не содержит полей для замены.
Проверьте Ваш документ и пришлите его заново.`;

// Keyboards

export const InputKeyboard = (input: ParametersInput): ExtraEditMessage =>
  Extra.markup(markup =>
    markup.keyboard(
      isParametersInputEmpty(input) ? [CancelCommand] : [BackCommand, CancelCommand],
      { wrap: () => false }
    ).resize().oneTime(true)
  );

export const ClearKeyboard = (): ExtraEditMessage =>
    Extra.markup(markup => markup.removeKeyboard().resize());

// Statuses

export const DownloadSteps = [
  'Файл скачивается',
  'Сканирование',
];

export const ProcessingSteps = [
  'Обработка шаблона',
  'Создается PDF',
  'Файл отсылается',
];