export interface DocumentParameters {
  [name:string]: string;
}

export const parametersFrom = (names: string[], values: string[]): DocumentParameters =>
  names.reduce((result: DocumentParameters, name: string, index: number) => ({
    ...result,
    [name]: values[index],
  }), {});
