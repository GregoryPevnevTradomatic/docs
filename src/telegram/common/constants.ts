export enum ParameterInputMode {
  OneByOne = 'One',
  AllAtOnce = 'All',
}

export const SUPPORTED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const SUPPORTED_EXTENSIONS = [
  '.docx'
];

// Text

export const ParameterInputModesText = {
  'One by one': ParameterInputMode.OneByOne,
  'All at once': ParameterInputMode.AllAtOnce,
};

export const AbortCommand = 'Abort';