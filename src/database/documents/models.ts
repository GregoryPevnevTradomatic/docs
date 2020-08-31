import { Document, DocumentFileType, DocumentParameters, DocumentStatus } from '../../models';

export interface SqlParameters {
  parameters: string[];
  values: string[];
}

export interface SqlDocumentData extends SqlParameters {
  doc_id: number;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  template_id: string;
  template_filename: string;
  template_created_at: string;
  result_id: string;
  result_filename: string;
  result_created_at: string;
}

export const parametersToSql = (params: DocumentParameters): SqlParameters => {
  const parameters: string[] = Object.keys(params);
  const values: string[] = parameters.map((param: string) => params[param]);

  return { parameters, values };
};

export const parametersFromSql = ({ parameters, values }: SqlParameters): DocumentParameters =>
  parameters.reduce((params: DocumentParameters, param: string, index: number) => ({
    ...params,
    [param]: values[index],
  }), {});

export const documentFromData = (data: SqlDocumentData): Document =>
  ({
    docId: data.doc_id,
    userId: data.user_id,
    status: DocumentStatus[data.status],
    parameters: parametersFromSql(data),
    template: {
      fileId: data.template_id,
      fileName: data.template_filename,
      fileType: DocumentFileType.Template,
    },
    result: {
      fileId: data.result_id,
      fileName: data.result_filename,
      fileType: DocumentFileType.Result,
    },
  });