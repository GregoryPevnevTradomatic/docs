interface FormattedParameters {
  [name:string]: string;
}

export interface DocumentParameters {
  names: string[];
  values: string[];
}

// TODO: Refactoring duplication with "ParametersInput"
//  - Storing together with "Parameters Input"???

const uniqueParameterNames = (names: string[]): string[] => {
  const table: { [name:string]: boolean } = {};

  return names.filter((paramName) => {
    if(table[paramName]) return false;

    table[paramName] = true;

    return true;
  });
};

export const initializeParameters = (parameters: string[]): DocumentParameters => ({
  names: uniqueParameterNames(parameters),
  values: [],
})

export const parametersFrom = (names: string[], values: string[]): DocumentParameters => ({
  names,
  values,
});

export const formatParameters = ({ names, values }: DocumentParameters): FormattedParameters =>
  names.reduce((params, name, index) => ({
    ...params,
    [name]: values[index],
  }), {});

export const parametersToList = ({ names }: DocumentParameters): string[] => names;

export const isParametersListEmpty = ({ names }: DocumentParameters): boolean =>
  names.length === 0;
