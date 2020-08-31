import KnexClient from 'knex';
import { Document, DocumentStatus } from '../../models';
import {
  SqlDocumentData,
  parametersToSql,
  documentFromData,
} from './models';
import {
  DocumentRepository,
  LoadDocument,
  LoadCurrentDocument,
  CreateDocument,
  UpdateDocument,
  AddFileToDocument
} from '../../services';
import { currentTimestamp } from '../../utilities';

const formatDocumentResult = (result: SqlDocumentData[]): Document =>
  result.length > 0 ? documentFromData(result[0]) : null;

const SqlLoadDocument = (knex: KnexClient): LoadDocument => (docId) =>
  knex.select('*').from('documents')
    .where({ doc_id: docId })
    .then(formatDocumentResult);

const SqlLoadCurrentDocument = (knex: KnexClient): LoadCurrentDocument => (userId) =>
  knex.select('*').from('documents')
    .where({
      user_id: userId,
      status: String(DocumentStatus.InProgress)
    }).then(formatDocumentResult);

const SqlCreateDocument = (knex: KnexClient): CreateDocument =>
  async (userId, initStatus, params) => {
    const status = String(initStatus);
    const { parameters, values } = parametersToSql(params);

    const result = await knex('docs').insert({
      user_id: userId,
      status,
      parameters,
      values,
    }).returning(['doc_id']);

    if(result.length === 0)
      return null;

    return {
      docId: Number(result[0]['doc_id']),
      userId,
      status: initStatus,
      parameters: params,
      template: null,
      result: null,
    };
  };

const SqlUpdateDocument = (knex: KnexClient): UpdateDocument =>
  async (document) => {
    const status = String(document.status);
    const { parameters, values } = parametersToSql(document.parameters);

    await knex('docs').update({
      status,
      parameters,
      values,
      updated_at: currentTimestamp(),
    }).where({ doc_id: document.docId });
  };

const SqlAddFile = (knex: KnexClient): AddFileToDocument =>
  async (document, file) => {
    await knex('files').insert({
      file_id: file.fileId,
      doc_id: document.docId,
      file_name: file.fileName,
      file_type: file.fileType,
    });
  };

export const createSqlDocumentRepository = (knex: KnexClient): DocumentRepository =>
  ({
    loadDocument: SqlLoadDocument(knex),
    loadCurrentDocument: SqlLoadCurrentDocument(knex),
    createDocument: SqlCreateDocument(knex),
    updateDocument: SqlUpdateDocument(knex),
    addFile: SqlAddFile(knex),
  });
