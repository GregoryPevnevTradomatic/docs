// Parameters

export enum ParameterInputMode {
  OneByOne = 'One',
  AllAtOnce = 'All',
}

export interface ParametersInput {
  mode: ParameterInputMode;
  parameters: string[];
  values: string[];
}

export const pushParameter = (params: string[], param: string): string[] =>
  [...params, param];

export const popParameter = (params: string[]): string[] =>
  params.length === 0 ? []: params.slice(0, params.length - 1);

export const isParametersInputComplete = (input: ParametersInput) =>
  input.parameters.length === input.values.length;

// Telegram

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
}

export interface TelegramFile {
  file_id: string;
  file_name?: string;
  mime_type?: string;
}
