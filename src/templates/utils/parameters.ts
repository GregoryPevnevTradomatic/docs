import { DocumentParameters } from '../../models';

const underscoreParam = (param: string): string => param.replace(/-/g, '_');
const whitespaceParam = (param: string): string => param.replace(/-/g, ' ');

export const extendParameters = (parameters: DocumentParameters): DocumentParameters =>
  Object.keys(parameters).reduce(
    (result, param) => ({
      ...result,
      [underscoreParam(param)]: parameters[param],
      [whitespaceParam(param)]: parameters[param],
    }),
    parameters
  );
