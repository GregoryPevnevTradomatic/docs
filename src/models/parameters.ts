export interface DocumentParameters {
  [name:string]: string;
}

export const emptyParameters = (names: string[]): DocumentParameters =>
  names.reduce((result: DocumentParameters, name: string) => ({
    ...result,
    [name]: null,
  }), {});

export const parametersFrom = (names: string[], values: string[]): DocumentParameters =>
  names.reduce((result: DocumentParameters, name: string, index: number) => ({
    ...result,
    [name]: values[index],
  }), {});

export const parameterNames = (parameters: DocumentParameters): string[] =>
  Object.keys(parameters).sort().slice();
