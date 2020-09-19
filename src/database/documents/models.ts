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

export const parametersToSql = ({ names, values }: DocumentParameters): SqlParameters =>
  ({
    parameters: names,
    values,
  });

export const parametersFromSql = ({ parameters, values }: SqlParameters): DocumentParameters =>
  ({
    names: parameters,
    values,
  });

export const documentFromData = (data: SqlDocumentData): Document =>
  ({
    docId: data.doc_id,
    userId: data.user_id,
    status: data.status as DocumentStatus,
    parameters: parametersFromSql(data),
    template: data.template_id !== null ? {
      fileId: data.template_id,
      fileName: data.template_filename,
      fileType: DocumentFileType.Template,
      fileData: null,
    } : null,
    result: data.result_id !== null ? {
      fileId: data.result_id,
      fileName: data.result_filename,
      fileType: DocumentFileType.Result,
      fileData: null,
    } : null,
  });