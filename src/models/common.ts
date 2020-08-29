export interface Parameters {
  [name:string]: string;
}

export const toParameters = (names: string[], values: string[]): Parameters =>
  names.reduce((result: Parameters, name: string, index: number) => ({
    ...result,
    [name]: values[index],
  }), {});
