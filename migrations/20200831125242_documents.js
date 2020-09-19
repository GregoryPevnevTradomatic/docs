const {
  DOCUMENTS_VIEW,
  DOCS_TABLE,
  FILES_TABLE,
  TEMPLATE_FILE_TYPE,
  RESULT_FILE_TYPE
} = require('./utils/constants'); // eslint-disable-line

exports.up = function(knex) {
  return knex.schema.raw(
    `
      CREATE VIEW ${DOCUMENTS_VIEW} AS
      SELECT
        ${DOCS_TABLE}.doc_id AS doc_id,
        ${DOCS_TABLE}.user_id AS user_id,
        ${DOCS_TABLE}.status AS status,
        ${DOCS_TABLE}.parameters AS parameters, 
        ${DOCS_TABLE}.values AS values,
        ${DOCS_TABLE}.created_at AS created_at,
        ${DOCS_TABLE}.updated_at AS updated_at,
        templates.file_id AS template_id,
        templates.file_name AS template_filename,
        templates.created_at AS template_created_at,
        results.file_id AS result_id,
        results.file_name AS result_filename,
        results.created_at AS result_created_at
      FROM ${DOCS_TABLE}
      LEFT JOIN ${FILES_TABLE} AS templates
        ON ${DOCS_TABLE}.doc_id = templates.doc_id AND templates.file_type = '${TEMPLATE_FILE_TYPE}'
      LEFT JOIN ${FILES_TABLE} AS results
        ON ${DOCS_TABLE}.doc_id = results.doc_id AND results.file_type = '${RESULT_FILE_TYPE}';
    `
  );
};

exports.down = function(knex) {
  return knex.schema.raw(`DROP VIEW ${DOCUMENTS_VIEW}`);
};
